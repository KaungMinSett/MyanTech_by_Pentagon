from django.urls import path, include
from rest_framework_nested import routers
from .views import *
from sales.views import AvailableProductListView

router = routers.DefaultRouter()
router.register(r'customers', CustomerViewSet, basename="customers")
router.register(r'productlist',AvailableProductListView,basename='productlist')
router.register(r'orders',OrderViewSet,basename='orders')
urlpatterns = [
    path('api/',include(router.urls))
]
