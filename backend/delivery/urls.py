# urls.py
from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import *

router = DefaultRouter()
router.register(r'delivery-groups', DeliveryGroupViewSet, basename='deliverygroup')
router.register(r'deliveries', DeliveryViewSet, basename='delivery')

urlpatterns = [
    path('', include(router.urls)),
]

# 1. /delivery-groups/ (GET, POST, PUT, PATCH, DELETE)
# 2. /delivery-groups/{id}/ (GET, PUT, PATCH, DELETE)
# 3. /delivery-groups/trigger-delivery-assignment/ (POST) - Custom action for warehouse manager
# 4. /deliveries/ (GET, POST, PUT, PATCH, DELETE)
# 5. /deliveries/{id}/ (GET, PUT, PATCH, DELETE)
# 6. /deliveries/{id}/update-status/ (PATCH) - Custom action for drivers
# 7. /deliveries/assigned-groups/ (GET) - Custom action for drivers to get assigned delivery groups
# 8. /deliveries/deliveries/ (GET) - Custom action for drivers to get deliveries within an assigned group


# Delivery System
# 1. Once the order is approved, the delivery record linked to that order is created

# 2. After the order is confirmed by the warehouse, it will count the number of orders with status "confirmed" and
# trigger the delivery assignment process once it's met a threshold 

# NOTE: condition of meeting a threshold
# When there are 30 orders found with CONFIRMED status, it will trigger the delivery assignment process

# 1 api end point for warehouse manager to trigger this delivery assignment process manually
# 3 api end points for driver to update order status complete or pending / get assigned delivery groups along with deliveries
# 1 api end points to show the list of delivery groups including deliveries for all in warehouse department