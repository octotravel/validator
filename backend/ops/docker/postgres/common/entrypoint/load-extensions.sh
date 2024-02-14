#!/bin/sh
set -e

psql -v ON_ERROR_STOP=1 --username "$POSTGRES_USER" --dbname "octo" <<-EOSQL
  create extension if not exists "pg_trgm";
EOSQL

psql -v ON_ERROR_STOP=1 --username "$POSTGRES_USER" --dbname "octo_test" <<-EOSQL
  create extension if not exists "pg_trgm";
EOSQL