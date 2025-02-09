from django.shortcuts import render

# Create your views here.

from rest_framework import viewsets

from .models import Brand, Category, Product, Warehouse, InventoryList
from .serializers import BrandSerializer, CategorySerializer, ProductSerializer, WarehouseSerializer, InventoryListSerializer

class BrandViewSet(viewsets.ModelViewSet):
    queryset = Brand.objects.all()
    serializer_class = BrandSerializer

class CategoryViewSet(viewsets.ModelViewSet):
    queryset = Category.objects.all()
    serializer_class = CategorySerializer

class ProductViewSet(viewsets.ModelViewSet):
    queryset = Product.objects.all()
    serializer_class = ProductSerializer

class WarehouseViewSet(viewsets.ModelViewSet):
    queryset = Warehouse.objects.all()
    serializer_class = WarehouseSerializer

class InventoryListViewSet(viewsets.ModelViewSet):
    queryset = InventoryList.objects.all()
    serializer_class = InventoryListSerializer