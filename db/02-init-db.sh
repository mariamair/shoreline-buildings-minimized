#!/bin/bash
set -e

echo "DB_USER is set: ${DB_USER:+yes}"
echo "DB_USER_PASSWORD is set: ${DB_USER_PASSWORD:+yes}"

psql -v ON_ERROR_STOP=1 --username "$POSTGRES_USER" --dbname "$POSTGRES_DB" \
  -v db_user="$DB_USER" \
  -v db_password="$DB_USER_PASSWORD" \
  <<-EOSQL
    CREATE USER :"db_user" WITH PASSWORD :'db_password';
    GRANT CONNECT ON DATABASE ${POSTGRES_DB} TO :"db_user";
    GRANT USAGE ON SCHEMA public TO :"db_user";
    GRANT SELECT, INSERT, UPDATE, DELETE ON ALL TABLES IN SCHEMA public TO :"db_user";
    ALTER DEFAULT PRIVILEGES IN SCHEMA public
        GRANT SELECT, INSERT, UPDATE, DELETE ON TABLES TO :"db_user";
EOSQL

echo "App user created successfully"