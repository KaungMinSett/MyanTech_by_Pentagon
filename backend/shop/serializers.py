from .models import Customer,Address
from rest_framework import serializers
from djoser.serializers import UserSerializer as BaseUserSerializer
from django.contrib.auth import get_user_model
from .models import ReturnRequest, ReturnRequestItem

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


class ReturnRequestItemSerializer(serializers.ModelSerializer):
    class Meta:
        model = ReturnRequestItem
        fields = ['order_item', 'quantity']
        extra_kwargs = {
            'order_item': {'required': True},
            'quantity': {'required': True}
        }

class ReturnRequestSerializer(serializers.ModelSerializer):
    items = ReturnRequestItemSerializer(many=True, required=True)

    class Meta:
        model = ReturnRequest
        fields = ['customer', 'order', 'issue_description', 'items']
        extra_kwargs = {
            'customer': {'required': True},
            'order': {'required': True}
        }

    def validate_items(self, value):
        if len(value) < 1:
            raise serializers.ValidationError("At least one return item is required")
        return value

    def create(self, validated_data):
        items_data = validated_data.pop('items')
        return_request = ReturnRequest.objects.create(**validated_data)
        
        for item_data in items_data:
            ReturnRequestItem.objects.create(return_request=return_request, **item_data)
            
        return return_request

