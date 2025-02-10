from django.shortcuts import render

# Create your views here.

from rest_framework import viewsets, status
from rest_framework.response import Response
from rest_framework.decorators import action

from .models import Brand, Category, Product, Warehouse, InventoryList, Outbound, Inbound
from .serializers import BrandSerializer, CategorySerializer, ProductSerializer, WarehouseSerializer, InventoryListSerializer, InboundSerializer, OutboundSerializer, InboundApprovalSerializer
from .permissions import IsEmployee 

class BrandViewSet(viewsets.ModelViewSet):
    queryset = Brand.objects.all()
    serializer_class = BrandSerializer
    permission_classes = [IsEmployee] 

class CategoryViewSet(viewsets.ModelViewSet):
    queryset = Category.objects.all()
    serializer_class = CategorySerializer
    permission_classes = [IsEmployee] 

class ProductViewSet(viewsets.ModelViewSet):
    queryset = Product.objects.all()
    serializer_class = ProductSerializer
    permission_classes = [IsEmployee]

class WarehouseViewSet(viewsets.ModelViewSet):
    queryset = Warehouse.objects.all()
    serializer_class = WarehouseSerializer
    permission_classes = [IsEmployee] 

class InventoryListViewSet(viewsets.ModelViewSet):
    queryset = InventoryList.objects.all()
    serializer_class = InventoryListSerializer
    permission_classes = [IsEmployee]

class InboundViewSet(viewsets.ModelViewSet):
    queryset = Inbound.objects.all()
    serializer_class = InboundSerializer
    # permission_classes = [IsStaff]  # Staff can create/view their requests

    def get_serializer_class(self):
        # Use different serializer for approval action
        if self.action == 'approve':
            return InboundApprovalSerializer
        return super().get_serializer_class()

    def perform_create(self, serializer):
        # Staff creates inbound request for existing product
        serializer.save(created_by=self.request.user)

    # permission_classes=[IsManager]
    @action(detail=True, methods=['patch'], ) 
    def approve(self, request, pk=None):
        inbound = self.get_object()
        serializer = self.get_serializer(inbound, data=request.data, partial=True)
        serializer.is_valid(raise_exception=True)
        
        # Save with resolved_by and status
        serializer.save(resolved_by=request.user)
        
        # No direct inventory update here - let signals handle it
        return Response(serializer.data)




class OutboundViewSet(viewsets.ModelViewSet):
    queryset = Outbound.objects.all()
    serializer_class = OutboundSerializer
    permission_classes = [IsEmployee]