#!/usr/bin/env bash
# ============================================================
# Konfiguracja panelu super admina KSCSYSTEM (admin.kscsystem.pl)
# Uruchom NA SERWERZE: bash scripts/setup-admin.sh
# Bez sekretów w repo: DATABASE_URL brany z env serwera, hasło generowane i wypisywane.
# ============================================================
set -euo pipefail

ROOT="$(cd "$(dirname "$0")/.." && pwd)"
cd "$ROOT"
echo "==> Katalog: $ROOT"

# 1) DATABASE_URL z istniejacego env serwera (nie z repo)
DB="$(grep -hRE '^DATABASE_URL=' .env packages/db/.env apps/web/.env apps/web/.env.production.local 2>/dev/null \
      | grep -v 'USER:PASSWORD' | head -1 | cut -d= -f2- | tr -d '"' || true)"
if [ -z "${DB:-}" ]; then
  echo "!! Nie znalazlem DATABASE_URL w env serwera. Przerwane." >&2
  exit 1
fi

# 2) env admina (gitignore) — tworzony tylko jesli brak
if [ ! -f apps/admin/.env.production.local ]; then
  printf 'DATABASE_URL="%s"\nJWT_SECRET="%s"\n' "$DB" "$(openssl rand -base64 48)" > apps/admin/.env.production.local
  echo "==> Utworzono apps/admin/.env.production.local"
else
  echo "==> apps/admin/.env.production.local juz istnieje — pomijam"
fi

# 3) Schemat bazy (tabele audytu) — idempotentne
npx prisma db push --schema=packages/db/prisma/schema.prisma --skip-generate

# 4) Haslo superadmina (losowe, wypisane na koniec)
PASS="$(openssl rand -base64 15 | tr -d '/+=' | cut -c1-16)"
DATABASE_URL="$DB" ADMIN_EMAIL="biuro@silers.pl" ADMIN_PASSWORD="$PASS" \
  npm run db:set-admin-password -w @kscsystem/db

# 5) Proces pm2 na porcie 3002
pm2 restart kscsystem-admin 2>/dev/null || (cd apps/admin && pm2 start npm --name kscsystem-admin -- start)
pm2 save

# 6) nginx (wymaga sudo) — vhost + walidacja przed reload
if command -v nginx >/dev/null 2>&1; then
  sudo tee /etc/nginx/sites-available/admin.kscsystem.pl >/dev/null <<'NGINX'
server {
    listen 80;
    server_name admin.kscsystem.pl;
    location / {
        proxy_pass http://127.0.0.1:3002;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }
}
NGINX
  sudo ln -sf /etc/nginx/sites-available/admin.kscsystem.pl /etc/nginx/sites-enabled/
  if sudo nginx -t; then
    sudo systemctl reload nginx
    echo "==> nginx: vhost admin.kscsystem.pl aktywny"
  else
    echo "!! nginx -t nie przeszedl — NIE przeladowano. Sprawdz konfiguracje." >&2
  fi
fi

# 7) SSL — tylko gdy DNS juz wskazuje na ten serwer
if command -v certbot >/dev/null 2>&1; then
  if getent hosts admin.kscsystem.pl >/dev/null 2>&1; then
    sudo certbot --nginx -d admin.kscsystem.pl --non-interactive --agree-tos -m biuro@silers.pl || \
      echo "!! certbot nie zakonczyl sie sukcesem — sprawdz po ustawieniu DNS."
  else
    echo "==> DNS admin.kscsystem.pl jeszcze nie wskazuje serwera — pomijam SSL (dodaj rekord A i uruchom: sudo certbot --nginx -d admin.kscsystem.pl)"
  fi
fi

echo "============================================================"
echo " GOTOWE. Dane logowania do panelu admina:"
echo "   URL:   https://admin.kscsystem.pl/login  (po DNS + SSL)"
echo "   Login: biuro@silers.pl"
echo "   Haslo: $PASS"
echo " Zmien haslo po pierwszym logowaniu."
echo "============================================================"
