from django.urls import path
from hr.views import EmployeeLoginView

urlpatterns = [
    path('employees/login/', EmployeeLoginView.as_view(), name='employee_login'),
]
