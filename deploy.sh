#!/usr/bin/env bash

set -euo pipefail

if ! command -v lftp >/dev/null 2>&1; then
  echo "Error: lftp no esta instalado."
  echo "Instalalo con: brew install lftp"
  exit 1
fi

if [ ! -f .env ]; then
  echo "Error: no existe el archivo .env"
  exit 1
fi

set -a
. ./.env
set +a

: "${VITE_FTP_HOST:?Falta VITE_FTP_HOST en .env}"
: "${VITE_FTP_USER:?Falta VITE_FTP_USER en .env}"
: "${VITE_FTP_PASSWORD:?Falta VITE_FTP_PASSWORD en .env}"
: "${VITE_FTP_REMOTE_DIR:?Falta VITE_FTP_REMOTE_DIR en .env}"

echo "Construyendo proyecto..."
npm run build

if [ ! -d dist/assets ]; then
  echo "Error: dist/assets no existe. El build no genero los archivos esperados."
  exit 1
fi

echo "Subiendo dist/ a ${VITE_FTP_HOST}:${VITE_FTP_REMOTE_DIR} ..."
lftp -u "${VITE_FTP_USER},${VITE_FTP_PASSWORD}" "${VITE_FTP_HOST}" <<EOF
set cmd:fail-exit yes
set ftp:ssl-allow no
set ssl:verify-certificate no
mirror -R --delete --verbose dist/ ${VITE_FTP_REMOTE_DIR}
bye
EOF

echo "Deploy completado."
