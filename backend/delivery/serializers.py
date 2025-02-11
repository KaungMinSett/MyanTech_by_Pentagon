# serializers.py
from rest_framework import serializers
from .models import DeliveryGroup, Delivery
from warehouse.models import Warehouse
from hr.models import Employee

class DeliveryGroupSerializer(serializers.ModelSerializer):
    class Meta:
        model = DeliveryGroup
        fields = '__all__'
        read_only_fields = ('created_at', 'last_updated_at', 'status')
    
    def validate_employee(self, value):
        """Ensure employee is from warehouse department"""
        if value.department.name.lower() != 'warehouse':
            raise serializers.ValidationError("Employee must be from warehouse department")
        return value

class DeliverySerializer(serializers.ModelSerializer):
    
    class Meta:
        model = Delivery
        fields = '__all__'
        read_only_fields = ('created_at', 'last_updated_at', 'distance_from_warehouse', 'sequence_number')