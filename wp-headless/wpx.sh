#!/usr/bin/env bash
# Reusable WP-CLI wrapper for the auxtech-v2 LocalWP site.
# Usage: bash wpx.sh <wp-cli args...>
PHP="C:/Users/murad/AppData/Roaming/Local/lightning-services/php-8.3.29+1/bin/win64/php.exe"
EXT="C:/Users/murad/AppData/Roaming/Local/lightning-services/php-8.3.29+1/bin/win64/ext"
PHAR="F:/New folder (2)/Local/resources/extraResources/bin/wp-cli/wp-cli.phar"
SITE="C:/Users/murad/Local Sites/auxtech-v2/app/public"
exec "$PHP" -d extension_dir="$EXT" -d extension=mysqli -d memory_limit=1024M "$PHAR" --path="$SITE" "$@"
