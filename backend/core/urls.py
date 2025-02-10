from django.urls import path
from hr.views import EmployeeLoginView
from shop.views import CustomerLoginView
from rest_framework_simplejwt.views import TokenRefreshView

urlpatterns = [
    path('employees/login/', EmployeeLoginView.as_view(), name='employee_login'),
    path('customers/login', CustomerLoginView.as_view(), name='customer_login'),
    path('jwt/refresh/', TokenRefreshView.as_view(), name='jwt-refresh'),
]
