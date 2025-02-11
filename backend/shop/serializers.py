from .models import Customer,Address
from rest_framework import serializers
from djoser.serializers import UserSerializer as BaseUserSerializer
from django.contrib.auth import get_user_model
from sales.models import Price,Order,OrderItem
from warehouse.models import Product
from hr.models import Employee

User = get_user_model()

class CustomerSerializer(serializers.ModelSerializer):
    
    user = BaseUserSerializer()

    class Meta:
        model = Customer
        fields = ("id", "user")

class AddressSerializer(serializers.ModelSerializer):
    class Meta:
        model = Address
        fields = ['customer_id','name']

