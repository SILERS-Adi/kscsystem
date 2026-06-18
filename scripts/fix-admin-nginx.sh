#!/usr/bin/env bash
# ============================================================
# Naprawia routing nginx: kscsystem.pl/admin -> 127.0.0.1:3002
# Wstawia 'location /admin' do bloku server :443 (kotwica: ssl_certificate_key).
# Idempotentny: usuwa wczesniejsze wstawienia przed dodaniem nowego.
# Uruchom NA SERWERZE: bash scripts/fix-admin-nginx.sh
# ============================================================
set -euo pipefail

CONF="$(grep -rlE 'server_name[^;]*kscsystem\.pl' /etc/nginx/sites-available /etc/nginx/sites-enabled /etc/nginx/conf.d 2>/dev/null | head -1 || true)"
if [ -z "${CONF:-}" ]; then
  echo "!! Nie znalazlem vhosta kscsystem.pl w nginx." >&2
  exit 1
fi
echo "==> Vhost: $CONF"

BAK="${CONF}.ksc-bak-$(date +%s)"
sudo cp "$CONF" "$BAK"
echo "==> Backup: $BAK"

BLOCK='
    # --- KSCSYSTEM admin (basePath /admin -> 127.0.0.1:3002) ---
    location /admin {
        proxy_pass http://127.0.0.1:3002;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection "upgrade";
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }'

TMP1="$(mktemp)"; TMP2="$(mktemp)"

# 1) Usun wszystkie istniejace bloki 'location /admin { ... }' oraz marker
sudo awk '
  /# --- KSCSYSTEM admin/ { next }
  (!skip) && /location[[:space:]]+\/admin[[:space:]]*\{/ { skip=1; d=0 }
  skip {
    o=gsub(/\{/,"{"); d+=o; c=gsub(/\}/,"}"); d-=c;
    if (d<=0) { skip=0 }
    next
  }
  { print }
' "$CONF" > "$TMP1"

# 2) Wstaw blok TUZ PO linii ssl_certificate_key (czyli wewnatrz bloku :443)
sudo awk -v ins="$BLOCK" '
  { print }
  (!done) && /ssl_certificate_key/ { print ins; done=1 }
  END { if (!done) exit 3 }
' "$TMP1" > "$TMP2" || ANCHOR_MISS=1

if [ "${ANCHOR_MISS:-0}" = "1" ]; then
  echo "!! Nie znalazlem 'ssl_certificate_key' (kotwica bloku 443)."
  echo "   Dodaj recznie ten blok do bloku server { listen 443 ... server_name kscsystem.pl }:"
  echo "------------------------------------------------------------"
  echo "$BLOCK"
  echo "------------------------------------------------------------"
  echo "   potem: sudo nginx -t && sudo systemctl reload nginx"
  rm -f "$TMP1" "$TMP2"
  exit 0
fi

sudo cp "$TMP2" "$CONF"
rm -f "$TMP1" "$TMP2"

if sudo nginx -t; then
  sudo systemctl reload nginx
  echo "==> OK: nginx przeladowany. /admin -> 127.0.0.1:3002"
  echo "==> Test:"
  curl -s -o /dev/null -w "   localhost:3002/admin/login -> %{http_code}\n" http://127.0.0.1:3002/admin/login || true
else
  echo "!! nginx -t NIE przeszedl — przywracam backup." >&2
  sudo cp "$BAK" "$CONF"
  sudo nginx -t >/dev/null 2>&1 || true
  exit 1
fi
