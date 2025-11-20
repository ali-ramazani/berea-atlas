from backend.database.db_config import ps_db
from backend.models import Office, Building, Contact, Admin
from backend.Logger import get_logger

logger = get_logger()

def init_db():
    ps_db.connect(reuse_if_open=True)
    ps_db.drop_tables([Office, Contact, Building, Admin], safe=True, cascade=True)
    logger.info(f"✅ Tables dropped successfully in {ps_db.database}.")
    ps_db.create_tables([Building, Contact, Office, Admin])
    logger.info(f"✅ Tables created successfully in {ps_db.database}.")
    ps_db.close()

if __name__ == "__main__":
    init_db()
