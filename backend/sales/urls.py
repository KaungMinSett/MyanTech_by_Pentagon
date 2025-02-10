from django.urls import path,include
from rest_framework.routers import DefaultRouter
from .views import OrderViewSet
routers = DefaultRouter()
routers.register(r'customers',OrderViewSet)

urlpatterns= [
    path('api/',include(routers.urls)),

]
