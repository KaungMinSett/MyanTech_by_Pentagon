from django.urls import path, include
from rest_framework_nested import routers
from .views import *
from sales.views import AvailableProductListView
from .views import *

router = routers.DefaultRouter()
router.register(r'customers', CustomerViewSet, basename="customers")
router.register(r'productlist',AvailableProductListView,basename='productlist')
router.register(r'orders',OrderViewSet,basename='orders')
router.register(r'return-requests', ReturnRequestViewSet, basename='return-request')

# Nested router for items
items_router = routers.NestedSimpleRouter(
    router, 
    r'return-requests', 
    lookup='return_request'
)
items_router.register(
    r'items', 
    ReturnRequestItemViewSet, 
    basename='return-request-items'
)
urlpatterns = [
    path('shop/',include(router.urls))
]
