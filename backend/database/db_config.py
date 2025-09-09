import os
from dotenv import load_dotenv
from peewee import PostgresqlDatabase

# Load .env from project root
load_dotenv()

DB_NAME = os.getenv("DB_NAME")
DB_USER = os.getenv("DB_USER")
DB_PASSWORD = os.getenv("DB_PASSWORD")
DB_HOST = os.getenv("DB_HOST", "localhost")
DB_PORT = int(os.getenv("DB_PORT", "5432"))  # must be int

assert DB_NAME, "DB_NAME is not set"
assert DB_USER, "DB_USER is not set"

ps_db = PostgresqlDatabase(
    DB_NAME,
    user=DB_USER,
    password=DB_PASSWORD,
    host=DB_HOST,
    port=DB_PORT,
)
