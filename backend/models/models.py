import uuid
from peewee import Model, CharField, TextField, UUIDField, ForeignKeyField, DoubleField
from backend.database.db_config import ps_db

class BaseModel(Model):
    class Meta:
        database = ps_db

class Building(BaseModel):
    building_id = UUIDField(primary_key=True, default=uuid.uuid4)
    name        = CharField(max_length=150, null=False)
    description = TextField(null=True)
    address     = CharField(max_length=255, null=False)
    latitude    = DoubleField(null=False)
    longitude   = DoubleField(null=False)
    accessibility_info = TextField(null=True)

    class Meta:
        table_name = "building"
        indexes = (
            (("latitude", "longitude"), False),
        )


class Contact(BaseModel):
    contact_id = UUIDField(primary_key=True, default=uuid.uuid4)
    name       = CharField(max_length=150, null=False)
    email      = CharField(max_length=150, null=False)
    phone      = CharField(max_length=50, null=True)
    role       = CharField(max_length=100, null=False)
    website = TextField(null=True)

    class Meta:
        table_name = "contact"

class Office(BaseModel):
    office_id = UUIDField(primary_key=True, default=uuid.uuid4)
    building  = ForeignKeyField(
        Building,
        backref="offices",
        on_delete="CASCADE",
        null=False,
    )
    contact = ForeignKeyField(
        Contact,
        backref="offices",
        on_delete="SET NULL",
        null=True,
    )
    name        = CharField(max_length=150, null=False)
    room_number = CharField(max_length=50, null=False)
    floor       = CharField(max_length=50, null=False)
    description = TextField(null=True)
    website = TextField(null=True)

    class Meta:
        table_name = "office"

