from django.urls import path,include
from rest_framework.routers import DefaultRouter
from .views import OrderViewSet,OrderLogsViewSet,PriceViewSet
routers = DefaultRouter()
routers.register(r'orders',OrderViewSet)
routers.register(r'orderlogs',OrderLogsViewSet)
routers.register(r'price-assign',PriceViewSet)

urlpatterns= [
    path('api/',include(routers.urls)),

]
