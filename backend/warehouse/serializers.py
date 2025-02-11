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
        fields = ['id', 'name', 'address']

class InventoryListSerializer(serializers.ModelSerializer):
    class Meta:
        model = InventoryList
        fields = ['id', 'product', 'warehouse', 'quantity']
    
class InboundSerializer(serializers.ModelSerializer):
    class Meta:
        model = Inbound
        fields = ['id', 'name', 'category', 'brand', 'description', 'status', 'created_by', 'resolved_by']
        read_only_fields = ('created_by', 'resolved_by', 'created_at', 'updated_at')
    

        fields = [
            'id', 'product',  'status', 'warehouse','quantity',
            'created_by', 'resolved_by', 
            'created_at', 'updated_at'  # Include timestamps
        ]
        read_only_fields = (
            'created_by', 'resolved_by', 
            'created_at', 'updated_at', 'status'  # Add 'status' if staff shouldn't set it
        )

    def validate(self, data):
        # Ensure product exists (only needed if 'product' is writable)
        if not Product.objects.filter(pk=data['product'].pk).exists():
            raise serializers.ValidationError("Product does not exist")
        return data

class InboundApprovalSerializer(serializers.ModelSerializer):
    class Meta:
        model = Inbound
        fields = ['status', 'resolved_by']  # Show resolved_by in responses
        read_only_fields = ['resolved_by']  # Auto-set in the view




class OutboundSerializer(serializers.ModelSerializer):
    class Meta:
        model = Outbound
        fields = '__all__'


