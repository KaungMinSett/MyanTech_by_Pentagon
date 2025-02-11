from .models import Customer,Address
from rest_framework import serializers
from djoser.serializers import UserSerializer as BaseUserSerializer
from django.contrib.auth import get_user_model
from sales.models import Price
from warehouse.models import Product
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

class ProductSerializer(serializers.ModelSerializer):
    price = serializers.SerializerMethodField()
    available_stock = serializers.SerializerMethodField()
    class Meta:
        model = Product
        fields = ['id','name','category','brand','description','price','available_stock']

    def get_price(self,obj):
        price = Price.objects.filter(product_id=obj,is_published= True).first()
        return price.price if price else None




