from djoser.serializers import UserSerializer as BaseUserSerializer, UserCreateSerializer as BaseUserCreateSerializer, TokenCreateSerializer as BaseTokenCreateSerializer
from django.db import transaction
from django.conf import settings
from django.contrib.auth import get_user_model
from rest_framework import serializers
from shop.models import Customer
from sales.models import Order
from delivery.models import Delivery, DeliveryGroup
from shop.serializers import AddressSerializer
from sales.serializers import OrderItemSerializer

User = get_user_model()

class CustomUserSerializer(BaseUserSerializer):
    class Meta(BaseUserSerializer.Meta):
        fields = BaseUserSerializer.Meta.fields + ("employee", "customer")

class UserCreateSerializer(BaseUserCreateSerializer):
    
    class Meta(BaseUserCreateSerializer.Meta):
        fields = ['id', 'email', 'username', 'password']
        
    def create(self, validated_data):
        user = super().create(validated_data)
        Customer.objects.create(user=user)
        return user
    
class TokenCreateSerializer(BaseTokenCreateSerializer):
    
    def validate(self, attrs):
        print("<<<<<<<< triggered >>>>>>>>>> ")
        attrs = super().validate(attrs)
        user = self.user
        if user.is_staff:
            raise serializers.ValidationError('Credentials of Staffs are not allowed here')
        return attrs
    
    def create(self, validated_data):
        print("<Create triggered>>>")
        return super().create(validated_data)

class CustomerDeliveryGroupSerializer(serializers.ModelSerializer):
    class Meta:
        model = DeliveryGroup
        fields = ["id", "status", "employee", "latitude", "longitude", "last_updated_at"]

class CustomerDeliverySerializer(serializers.ModelSerializer):
    delivery_group = CustomerDeliveryGroupSerializer()
    class Meta:
        model = Delivery
        fields = ["id", "status", "last_updated_at", "delivery_group"]

class CustomerOrderSerializer(serializers.ModelSerializer):
    
    address = AddressSerializer()
    order_items = OrderItemSerializer(many=True, read_only=True)
    deliveries = CustomerDeliverySerializer(many=True, read_only=True, source="delivery")
    
    class Meta:
        model = Order
        fields = ["id", "order_items", "deliveries", "address", "order_date", "order_type", "status"]
        read_only_fields = ["order_type", "status", "order_date"]
    
