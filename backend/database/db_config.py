import os
import psycopg2
import psycopg2.extras

def get_db_connection():
    return psycopg2.connect(
        host=os.getenv("DB_HOST", "localhost"),
        database=os.getenv("DB_NAME", "berea_atlas"),
        user=os.getenv("DB_USER", "ali"),
        password=os.getenv("DB_PASSWORD", "secret"),
        port=os.getenv("DB_PORT", "5432"),
        cursor_factory=psycopg2.extras.DictCursor
)