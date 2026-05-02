from pymongo import MongoClient
from django.conf import settings

def get_mongo_client():
    return MongoClient(settings.MONGO_URI)

def get_db():
    client = get_mongo_client()
    db_name = settings.MONGO_DB_NAME
    return client[db_name]

def get_employees_collection():
    return get_db()['employees']

def get_notes_collection():
    return get_db()['notes']
