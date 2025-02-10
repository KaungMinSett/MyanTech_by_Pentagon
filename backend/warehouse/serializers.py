from rest_framework import serializers
from .models import Brand, Category, Product, Warehouse, InventoryList, Inbound, Outbound

class BrandSerializer(serializers.ModelSerializer):
    class Meta:
        model = Brand
        fields = ['id', 'name']

class CategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = Category
        fields = ['id', 'name']

class ProductSerializer(serializers.ModelSerializer):
    class Meta:
        model = Product
        fields = ['id', 'name', 'category', 'brand', 'description']

class WarehouseSerializer(serializers.ModelSerializer):
    class Meta:
        model = Warehouse
        fields = ['id', 'name', 'location']

class InventoryListSerializer(serializers.ModelSerializer):
    class Meta:
        model = InventoryList
        fields = ['id', 'product', 'warehouse', 'quantity']
    
class InboundSerializer(serializers.ModelSerializer):
    class Meta:
        model = Inbound
        fields = ['id', 'name', 'category', 'brand', 'description', 'status', 'created_by', 'resolved_by']
        read_only_fields = ['status', 'created_by', 'resolved_by']

class ProductApprovalSerializer(serializers.ModelSerializer):
    class Meta:
        model = Inbound
        fields = ['status']
        extra_kwargs = {'status': {'required': True}}




class OutboundSerializer(serializers.ModelSerializer):
    class Meta:
        model = Outbound
        fields = '__all__'