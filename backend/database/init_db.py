from backend.database.db_config import ps_db
from backend.models import Office, Building, Contact

def init_db():
    ps_db.connect(reuse_if_open=True)
    ps_db.drop_tables([Office, Contact, Building], safe=True, cascade=True)
    ps_db.create_tables([Building, Contact, Office])  # IMPORTANT: parents first
    print(f"✅ Database created successfully in {ps_db.database}.")
    ps_db.close()

if __name__ == "__main__":
    init_db()
