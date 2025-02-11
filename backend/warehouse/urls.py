from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import BrandViewSet, CategoryViewSet, ProductViewSet, WarehouseViewSet, InventoryListViewSet, InboundViewSet, OutboundViewSet

app_name = "warehouse"

router = DefaultRouter()
router.register(r'brands', BrandViewSet)
router.register(r'categories', CategoryViewSet)
router.register(r'products', ProductViewSet)
router.register(r'warehouses', WarehouseViewSet)
router.register(r'inventory', InventoryListViewSet)
router.register(r'inbounds', InboundViewSet, basename='inbound')

router.register(r'outbounds', OutboundViewSet)  


urlpatterns = [
    path('api/', include(router.urls)),
]

