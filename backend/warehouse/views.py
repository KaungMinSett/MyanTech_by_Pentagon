from django.shortcuts import render

# Create your views here.

from rest_framework import viewsets, status
from rest_framework.response import Response
from rest_framework.decorators import action

from .models import Brand, Category, Product, Warehouse, InventoryList, Outbound, Inbound
from .serializers import BrandSerializer, CategorySerializer, ProductSerializer, WarehouseSerializer, InventoryListSerializer, InboundSerializer,ProductApprovalSerializer, OutboundSerializer
from .permissions import IsEmployee , IsManager, IsStaff

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
    permission_classes = [IsStaff]  # Staff can create/view their requests

    def perform_create(self, serializer):
        serializer.save(created_by=self.request.user)

    @action(detail=True, methods=['patch'], permission_classes=[IsManager])
    def approve(self, request, pk=None):
        product_request = self.get_object()
        serializer = ProductApprovalSerializer(product_request, data=request.data, partial=True)
        if serializer.is_valid():
            # If approved, create the Product
            if serializer.validated_data['status'] == 'approved':
                Product.objects.create(
                    name=product_request.name,
                    category=product_request.category,
                    brand=product_request.brand,
                    description=product_request.description
                )
            serializer.save(resolved_by=request.user)
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class OutboundViewSet(viewsets.ModelViewSet):
    queryset = Outbound.objects.all()
    serializer_class = OutboundSerializer
    permission_classes = [IsEmployee]