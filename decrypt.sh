#!/bin/sh

# --batch to prevent interactive command
# --yes to assume "yes" for questions

gpg --quiet --batch --yes --decrypt --passphrase="$LARGE_SECRET_PASSPHRASE" \
--output $HOME/correcteur-fuyukitrad/backend/correction-sheets/client_secret.json \
$HOME/correcteur-fuyukitrad/backend/correction-sheets/client_secret.json.gpg