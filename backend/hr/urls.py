from django.urls import path, include
from rest_framework_nested import routers
from .views import EmployeeViewSet

router = routers.DefaultRouter()
router.register(r'employees', EmployeeViewSet, basename="employees")

urlpatterns = router.urls

# from django.urls import path, include
# from rest_framework.routers import DefaultRouter  # ✅ Correct import
# from .views import EmployeeViewSet

# router = DefaultRouter()
# router.register(r'employees', EmployeeViewSet, basename="employees")

# urlpatterns = [
#     path('', include(router.urls)),  # ✅ Ensure URLs are included properly
# ]
