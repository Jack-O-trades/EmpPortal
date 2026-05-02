import pandas as pd
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from bson import ObjectId
from .db import get_employees_collection, get_notes_collection
import math
import cloudinary
import cloudinary.uploader
class FileUploadView(APIView):
    # permission_classes = [IsAuthenticated]

    def post(self, request):
        file = request.FILES.get('file')
        manual_location = request.POST.get('location', '').strip()
        
        if not file:
            return Response({'error': 'No file uploaded'}, status=400)
        if not manual_location:
            return Response({'error': 'Location name is required'}, status=400)
            
        try:
            # Read ALL sheets using pandas
            xls = pd.read_excel(file, sheet_name=None)
            all_records = []
            
            for sheet_name, df in xls.items():
                if df.empty:
                    continue
                    
                # Replace pandas NaNs with None so MongoDB stores them as null cleanly
                df = df.where(pd.notnull(df), None)
                
                # Standardize column names
                col_map = {}
                for c in df.columns:
                    cl = str(c).lower().replace(' ', '').replace('_', '')
                    if cl in ['name', 'employeename', 'full_name', 'fullname']: col_map[c] = 'name'
                    elif cl in ['exitdate', 'dateofretirement', 'retirementdate', 'lastworkingday', 'enddate', 'expectedexitdate']: col_map[c] = 'exitDate'
                    elif cl in ['designation', 'post', 'jobtitle', 'position', 'role']: col_map[c] = 'designation'
                    elif cl in ['phone', 'phonenumber', 'mobile', 'mobilenumber', 'contact', 'contactnumber']: col_map[c] = 'phone'
                
                df.rename(columns=col_map, inplace=True)
                
                # Lowercase any other remaining columns for consistency
                df.columns = [c if c in ['name', 'exitDate', 'designation', 'phone'] else str(c).lower() for c in df.columns]
                
                # Proactively format any datetime columns to human-readable strings (e.g. '30 June 2026')
                for col in df.columns:
                    if pd.api.types.is_datetime64_any_dtype(df[col]):
                        df[col] = df[col].dt.strftime('%d %B %Y')
                
                records = df.to_dict(orient='records')
                
                # Add the sheet name and override place to each record for context
                for r in records:
                    r['source_sheet'] = sheet_name
                    r['place'] = manual_location
                    
                all_records.extend(records)
            
            if all_records:
                # Insert into MongoDB
                collection = get_employees_collection()
                collection.insert_many(all_records)
            
            return Response({'message': f'Successfully uploaded and inserted {len(all_records)} records across {len(xls)} sheets.'})
        except Exception as e:
            return Response({'error': str(e)}, status=500)

class ManualEntryView(APIView):
    def post(self, request):
        try:
            data = request.data
            
            name = data.get('name', '').strip()
            place = data.get('place', '').strip()
            
            if not name or not place:
                return Response({'error': 'Name and Place are required'}, status=400)
                
            doc = {
                'name': name,
                'place': place,
                'phone': data.get('phone', '').strip(),
                'exitDate': data.get('exitDate', '').strip(),
                'address': data.get('address', '').strip(),
                'designation': data.get('designation', '').strip(),
                'source_sheet': 'Manual Entry'
            }
            
            if doc['exitDate']:
                try:
                    dt = pd.to_datetime(doc['exitDate'])
                    doc['exitDate'] = dt.strftime('%d %B %Y')
                except:
                    pass
            collection = get_employees_collection()
            collection.insert_one(doc)
            
            return Response({'message': 'Data entered successfully!'})
        except Exception as e:
            return Response({'error': str(e)}, status=500)

class NotesView(APIView):
    def get(self, request):
        try:
            collection = get_notes_collection()
            notes = list(collection.find().sort('_id', -1))
            for note in notes:
                note['_id'] = str(note['_id'])
            return Response({'notes': notes})
        except Exception as e:
            return Response({'error': str(e)}, status=500)

    def post(self, request):
        try:
            data = request.data
            
            doc = {
                'name': data.get('name', '').strip(),
                'phone': data.get('phone', '').strip(),
                'address': data.get('address', '').strip(),
                'designation': data.get('designation', '').strip(),
                'extra_notes': data.get('extra_notes', '').strip(),
            }
            
            # Handle Image Upload for Notes
            image_url = None
            if 'image' in request.FILES:
                try:
                    upload_result = cloudinary.uploader.upload(request.FILES['image'])
                    image_url = upload_result.get('secure_url')
                    doc['image_url'] = image_url
                except Exception as img_err:
                    print("Cloudinary upload error:", str(img_err))
            
            collection = get_notes_collection()
            collection.insert_one(doc)
            
            return Response({'message': 'Note added successfully!'})
        except Exception as e:
            return Response({'error': str(e)}, status=500)


class PlaceListView(APIView):
    # permission_classes = [IsAuthenticated]

    def get(self, request):
        collection = get_employees_collection()
        # Find distinct places
        places = collection.distinct('place')
        places = [p for p in places if p] # filter out None/NaN
        return Response(places)

class EmployeeListView(APIView):
    # permission_classes = [IsAuthenticated]

    def get(self, request):
        collection = get_employees_collection()
        
        place = request.GET.get('place')
        search = request.GET.get('search', '')
        sort_by = request.GET.get('sort', 'name')
        page = int(request.GET.get('page', 1))
        limit = int(request.GET.get('limit', 10))
        
        query = {}
        if place:
            query['place'] = place
            
        if search:
            # Case-insensitive regex search on name and date fields
            query['$or'] = [
                {'name': {'$regex': search, '$options': 'i'}},
                {'exitDate': {'$regex': search, '$options': 'i'}},
                {'expected_exit_date': {'$regex': search, '$options': 'i'}},
                {'expectedexitdate': {'$regex': search, '$options': 'i'}},
                {'dob': {'$regex': search, '$options': 'i'}}
            ]
            
        # Determine sort direction. Assuming ascending for name, descending for date if needed.
        sort_dir = 1
        if sort_by.startswith('-'):
            sort_dir = -1
            sort_by = sort_by[1:]
            
        # Execute query
        cursor = collection.find(query).sort(sort_by, sort_dir).skip((page - 1) * limit).limit(limit)
        
        employees = []
        for emp in cursor:
            emp['_id'] = str(emp['_id']) # Convert ObjectId to string
            
            # Clean up NaNs and format dates
            for k, v in emp.items():
                if isinstance(v, float) and math.isnan(v):
                    emp[k] = None
                elif hasattr(v, 'isoformat'):
                    # Keep just the YYYY-MM-DD portion for cleaner UI
                    emp[k] = v.isoformat().split('T')[0]
                    
            employees.append(emp)
            
        total_count = collection.count_documents(query)
        
        return Response({
            'employees': employees,
            'total': total_count,
            'page': page,
            'limit': limit,
            'pages': math.ceil(total_count / limit)
        })

class EmployeeDetailView(APIView):
    # permission_classes = [IsAuthenticated]

    def get(self, request, emp_id):
        collection = get_employees_collection()
        try:
            emp = collection.find_one({'_id': ObjectId(emp_id)})
            if not emp:
                return Response({'error': 'Not found'}, status=404)
                
            emp['_id'] = str(emp['_id'])
            
            # Clean NaNs and format dates
            for k, v in emp.items():
                if isinstance(v, float) and math.isnan(v):
                    emp[k] = None
                elif hasattr(v, 'isoformat'):
                    emp[k] = v.isoformat().split('T')[0]
                    
            return Response(emp)
        except:
            return Response({'error': 'Invalid ID'}, status=400)
