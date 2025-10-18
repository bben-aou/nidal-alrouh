#!/bin/bash
set -e

# This script runs automatically when the database is first initialized
# Place additional .sql or .sh files in docker/postgres/init/ to run on startup

psql -v ON_ERROR_STOP=1 --username "$POSTGRES_USER" --dbname "$POSTGRES_DB" <<-EOSQL
    -- Enable commonly used extensions
    CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
    CREATE EXTENSION IF NOT EXISTS "pg_trgm";
    
    -- Create a readonly user (good practice for reporting/analytics)
    -- Uncomment if needed:
    -- CREATE ROLE readonly WITH LOGIN PASSWORD 'readonly_password';
    -- GRANT CONNECT ON DATABASE $POSTGRES_DB TO readonly;
    -- GRANT USAGE ON SCHEMA public TO readonly;
    -- GRANT SELECT ON ALL TABLES IN SCHEMA public TO readonly;
    -- ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT SELECT ON TABLES TO readonly;
    
    -- Log initialization completion
    SELECT 'Database initialized successfully' AS status;
EOSQL