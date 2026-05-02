from django.urls import path
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView
from .views import FileUploadView, PlaceListView, EmployeeListView, EmployeeDetailView
from .views import FileUploadView, PlaceListView, EmployeeListView, EmployeeDetailView, ManualEntryView

urlpatterns = [
    # Auth
    path('token/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    
    # App
    path('upload/', FileUploadView.as_view(), name='upload_excel'),
    path('manual-entry/', ManualEntryView.as_view(), name='manual-entry'),
    path('places/', PlaceListView.as_view(), name='place_list'),
    path('employees/', EmployeeListView.as_view(), name='employee_list'),
    path('employees/<str:emp_id>/', EmployeeDetailView.as_view(), name='employee_detail'),
]
