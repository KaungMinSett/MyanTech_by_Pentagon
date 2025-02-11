from django.shortcuts import render

# Create your views here.

from rest_framework import viewsets, status
from rest_framework.response import Response
from rest_framework.decorators import action

from .models import Brand, Category, Product, Warehouse, InventoryList, Outbound, Inbound
from .serializers import BrandSerializer, CategorySerializer, ProductSerializer, WarehouseSerializer, InventoryListSerializer, InboundSerializer, OutboundSerializer, InboundApprovalSerializer
from .permissions import IsEmployee 
from core.permissions import IsWarehouseStaff, IsWarehouseTeam, IsWarehouseManager

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
    permission_classes = [IsWarehouseTeam]  # Default for all actions

    # 1. Staff can CREATE, both roles can LIST/VIEW
    def get_permissions(self):
        if self.action == "create":
            return [IsWarehouseStaff()]  # Only staff can create
        return super().get_permissions()

    # 2. Managers can APPROVE
    @action(
        detail=True,
        methods=["patch"],
        permission_classes=[IsWarehouseManager],  # Only managers
        serializer_class= InboundApprovalSerializer

    )
    def approve(self, request, pk=None):
        inbound = self.get_object()
        serializer = self.get_serializer(inbound, data=request.data, partial=True)
        serializer.is_valid(raise_exception=True)
        serializer.save(resolved_by=request.user)
        return Response(serializer.data)

    # 3. Auto-set 'created_by' when staff creates a record
    def perform_create(self, serializer):
        serializer.save(created_by=self.request.user)



class OutboundViewSet(viewsets.ModelViewSet):
    queryset = Outbound.objects.all()
    serializer_class = OutboundSerializer
    permission_classes = [IsEmployee]