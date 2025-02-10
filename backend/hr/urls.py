from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import *

router = DefaultRouter()
router.register(r'employees', EmployeeViewSet, basename="employees")
router.register(r'departments', DepartmentViewSet, basename="departments")
router.register(r'roles', RoleViewSet, basename="roles")

urlpatterns = router.urls
