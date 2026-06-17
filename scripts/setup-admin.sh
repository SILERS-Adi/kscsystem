#!/usr/bin/env bash
# ============================================================
# Konfiguracja panelu super admina KSCSYSTEM pod kscsystem.pl/admin
# Uruchom NA SERWERZE: bash scripts/setup-admin.sh
# Bez sekretow w repo: DATABASE_URL z env serwera, JWT generowany, haslo losowe i wypisane.
# Aplikacja admin ma basePath '/admin' i chodzi na 127.0.0.1:3002.
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

# 3) Build admina (basePath '/admin' musi byc wkompilowany)
echo "==> Buduje apps/admin..."
npm run build -w apps/admin

# 4) Schemat bazy (tabele audytu) — idempotentne
npx prisma db push --schema=packages/db/prisma/schema.prisma --skip-generate

# 5) Haslo superadmina (losowe, wypisane na koniec)
PASS="$(openssl rand -base64 15 | tr -d '/+=' | cut -c1-16)"
DATABASE_URL="$DB" ADMIN_EMAIL="biuro@silers.pl" ADMIN_PASSWORD="$PASS" \
  npm run db:set-admin-password -w @kscsystem/db

# 6) Proces pm2 na porcie 3002
pm2 restart kscsystem-admin 2>/dev/null || (cd apps/admin && pm2 start npm --name kscsystem-admin -- start)
pm2 save

# 7) nginx: dodaj 'location /admin' do istniejacego vhosta kscsystem.pl
LOCATION_BLOCK='    # --- KSCSYSTEM admin (basePath /admin -> 127.0.0.1:3002) ---
    location /admin {
        proxy_pass http://127.0.0.1:3002;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection '"'"'upgrade'"'"';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }'

NGINX_DONE=0
if command -v nginx >/dev/null 2>&1; then
  CONF="$(grep -rlE 'server_name[^;]*kscsystem\.pl' /etc/nginx/sites-available /etc/nginx/conf.d /etc/nginx/sites-enabled 2>/dev/null | head -1 || true)"
  if [ -n "${CONF:-}" ]; then
    echo "==> Vhost kscsystem.pl: $CONF"
    if grep -q 'location /admin' "$CONF"; then
      echo "==> 'location /admin' juz istnieje — pomijam edycje nginx"
      NGINX_DONE=1
    else
      sudo cp "$CONF" "$CONF.ksc-bak"
      # wstaw blok przed ostatnim '}' (zwykle zamkniecie bloku server 443)
      awk -v ins="$LOCATION_BLOCK" '
        { lines[NR]=$0 }
        END {
          last=0
          for (i=1;i<=NR;i++) if (lines[i] ~ /^[[:space:]]*}[[:space:]]*$/) last=i
          for (i=1;i<=NR;i++) { if (i==last) print ins; print lines[i] }
        }' "$CONF.ksc-bak" | sudo tee "$CONF" >/dev/null
      if sudo nginx -t; then
        sudo systemctl reload nginx
        echo "==> nginx zaktualizowany i przeladowany"
        NGINX_DONE=1
      else
        echo "!! nginx -t NIE przeszedl — przywracam backup, nic nie zmieniono" >&2
        sudo cp "$CONF.ksc-bak" "$CONF"
        sudo nginx -t >/dev/null 2>&1 || true
      fi
    fi
  fi
fi

echo "============================================================"
echo " GOTOWE (aplikacja). Dane logowania:"
echo "   URL:   https://kscsystem.pl/admin/login"
echo "   Login: biuro@silers.pl"
echo "   Haslo: $PASS"
echo "   (zmien haslo po pierwszym logowaniu)"
if [ "$NGINX_DONE" != "1" ]; then
  echo ""
  echo " !! nginx NIE zostal automatycznie skonfigurowany."
  echo "    Dodaj recznie ten blok do bloku 'server { ... server_name kscsystem.pl; }' (czesc 443):"
  echo "------------------------------------------------------------"
  echo "$LOCATION_BLOCK"
  echo "------------------------------------------------------------"
  echo "    a potem: sudo nginx -t && sudo systemctl reload nginx"
fi
echo "============================================================"
