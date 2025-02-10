from django.urls import path, include
from rest_framework_nested import routers
from .views import *

router = routers.DefaultRouter()
router.register(r'employees', EmployeeViewSet, basename="employees")
router.register(r'departments', DepartmentViewSet, basename="departments")
router.register(r'roles', RoleViewSet, basename="roles")

urlpatterns = router.urls
