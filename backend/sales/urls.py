from django.urls import path,include
from rest_framework.routers import DefaultRouter
from .views import OrderViewSet,OrderLogsViewSet,PriceViewSet,CustomerViewSet,AvailableProductListView
routers = DefaultRouter()
routers.register(r'orders',OrderViewSet)
routers.register(r'orderlogs',OrderLogsViewSet)
routers.register(r'price-assign',PriceViewSet)
routers.register(r'customers',CustomerViewSet)
routers.register(r'saleproductlist',AvailableProductListView,basename='productlist')
urlpatterns= [
    path('api/',include(routers.urls)),

]