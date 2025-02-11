from django.urls import path, include
from rest_framework_nested import routers
from .views import DeliveryGroupViewSet, DeliveryViewSet

# Create a base router for DeliveryGroup
router = routers.DefaultRouter()
router.register(r'delivery-groups', DeliveryGroupViewSet, basename='deliverygroup')

# Create a nested router for Delivery under DeliveryGroup
delivery_group_router = routers.NestedSimpleRouter(router, r'delivery-groups', lookup='deliverygroup')
delivery_group_router.register(r'deliveries', DeliveryViewSet, basename='deliverygroup-deliveries')

urlpatterns = [
    path('', include(router.urls)),
    path('', include(delivery_group_router.urls)),
]

# GET/PUT/PATCH/DELETE ==> /delivery-groups/<group_id>/
# POST ==> /delivery-groups/delivery_assignment/
# GET/PUT/PATCH/DELETE ==> /delivery-groups/<group_id>/deliveries/<delivery_id>/
# PATCH ==> /delivery-groups/<group_id>/deliveries/<delivery_id>/complete/


# Delivery System
# 1. Once the order is approved, the delivery record linked to that order is created

# 2. After the order is confirmed by the warehouse, it will count the number of orders with status "confirmed" and
# trigger the delivery assignment process once it's met a threshold 

# NOTE: condition of meeting a threshold
# When there are 30 orders found with CONFIRMED status, it will trigger the delivery assignment process