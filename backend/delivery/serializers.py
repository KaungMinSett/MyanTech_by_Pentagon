from rest_framework import serializers
from .models import DeliveryGroup, Delivery
from warehouse.models import Warehouse
from hr.models import Employee

class DeliverySerializer(serializers.ModelSerializer):
    class Meta:
        model = Delivery
        fields = '__all__'
        read_only_fields = ('created_at', 'last_updated_at', 'distance_from_warehouse', 'sequence_number')

class DeliveryGroupSerializer(serializers.ModelSerializer):
    deliveries = DeliverySerializer(many=True, read_only=True, source='delivery_set')

    class Meta:
        model = DeliveryGroup
        fields = '__all__'
        read_only_fields = ('created_at', 'last_updated_at', 'status')
        
class WarehouseDeliveryGroupSerializer(serializers.ModelSerializer):
    class Meta:
        model = DeliveryGroup
        fields = '__all__'
        read_only_fields = ('created_at', 'last_updated_at', 'status')

class DriverDeliveryGroupSerializer(serializers.ModelSerializer):
    class Meta:
        model = DeliveryGroup
        fields = ['id', 'latitude', 'longitude', 'status', 'created_at', 'last_updated_at']

class DeliverySerializer(serializers.ModelSerializer):
    class Meta:
        model = Delivery
        fields = '__all__'
        read_only_fields = ('created_at', 'last_updated_at', 'distance_from_warehouse', 'sequence_number')