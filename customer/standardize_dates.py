import math
from pymongo import MongoClient
import pandas as pd
from datetime import datetime

client = MongoClient('mongodb+srv://OmmProut:HydroLipun123@employee.mgnxraa.mongodb.net/?retryWrites=true&w=majority')
db = client['employee_portal']
col = db['employees']

docs = list(col.find({}))
count = 0

def format_date(v):
    if not v: return v
    if isinstance(v, float) and math.isnan(v): return None
    
    # If it's a python datetime
    if isinstance(v, datetime):
        return v.strftime('%d %B %Y') # e.g. 30 June 2026
        
    # If it's a string, try parsing it
    if isinstance(v, str):
        v = v.strip()
        try:
            # Try DD/MM/YYYY
            dt = datetime.strptime(v, '%d/%m/%Y')
            return dt.strftime('%d %B %Y')
        except:
            pass
        try:
            # Try YYYY-MM-DD
            dt = datetime.strptime(v, '%Y-%m-%d')
            return dt.strftime('%d %B %Y')
        except:
            pass
            
    return v

for doc in docs:
    updates = {}
    
    if 'exitDate' in doc:
        new_val = format_date(doc['exitDate'])
        if new_val != doc['exitDate']: updates['exitDate'] = new_val
        
    if 'expected_exit_date' in doc:
        new_val = format_date(doc['expected_exit_date'])
        if new_val != doc['expected_exit_date']: updates['expected_exit_date'] = new_val
        
    if 'expectedexitdate' in doc:
        new_val = format_date(doc['expectedexitdate'])
        if new_val != doc['expectedexitdate']: updates['expectedexitdate'] = new_val
        
    if updates:
        col.update_one({'_id': doc['_id']}, {'$set': updates})
        count += 1
        
print(f"Updated {count} documents.")
