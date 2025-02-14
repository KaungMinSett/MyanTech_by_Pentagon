from .models import Customer,Address
from rest_framework import serializers
from djoser.serializers import UserSerializer as BaseUserSerializer
from django.contrib.auth import get_user_model
from .models import ReturnRequest, ReturnRequestItem
from sales.models import OrderItem, Order, Price
from decimal import Decimal

User = get_user_model()

class ConfirmOrderAddressSerializer(serializers.Serializer):
    lat = serializers.DecimalField(max_digits=9, decimal_places=6, source='latitude')  # Map to latitude
    lng = serializers.DecimalField(max_digits=9, decimal_places=6, source='longitude')  # Map to longitude
    name = serializers.CharField(allow_blank=True)

class ConfirmOrderItemSerializer(serializers.ModelSerializer):
    productId = serializers.IntegerField(source='product.product.id')  # Get Product ID from related models

    class Meta:
        model = OrderItem
        fields = ['productId', 'quantity']

class ConfirmOrderSerializer(serializers.Serializer):
    order_items = ConfirmOrderItemSerializer(many=True)
    phone = serializers.CharField(max_length=15, write_only=True)
    customer = serializers.IntegerField(write_only=True)
    address = ConfirmOrderAddressSerializer()
    
    def validate(self, data):
        if not data.get('order_items'):
            raise serializers.ValidationError("At least one order item is required.")
        return data

    def create(self, validated_data):
        order_items_data = validated_data.pop('order_items')
        phone = validated_data.get('phone')
        customer_id = validated_data.get('customer')
        address_data = validated_data.get('address')

        # Validate that latitude and longitude are present in address_data
        latitude = address_data.get('latitude')
        longitude = address_data.get('longitude')
        if latitude is None or longitude is None:
            raise serializers.ValidationError("Latitude and Longitude are required.")

        # 1. **Find Customer and Update Phone**
        customer = Customer.objects.filter(id=customer_id).first()
        if not customer:
            raise serializers.ValidationError("Customer not found.")

        if customer.phone != phone:
            customer.phone = phone
            customer.save()

        # 2. **Find or Create Address**
        address_name = address_data.get('name', "Unnamed Address")

        address, created = Address.objects.get_or_create(
            customer=customer,
            latitude=latitude,
            longitude=longitude,
            defaults={'name': address_name}
        )

        # 3. **Create Order**
        order = Order.objects.create(
            customer=customer,
            address=address,
            order_type="website",  # Set order type to "website"
            status="Pending"
        )

        # 4. **Create Order Items**
        product_ids = [item['product']['product']['id'] for item in order_items_data]
        products = Price.objects.filter(product__id__in=product_ids).select_related('product')

        product_map = {p.product.id: p for p in products}

        order_items = []
        for item_data in order_items_data:
            product_id = item_data['product']['product']['id']
            quantity = item_data['quantity']

            product = product_map.get(product_id)
            if not product:
                raise serializers.ValidationError(f"Product with ID {product_id} not found.")

            order_items.append(OrderItem(
                order=order,
                product=product,
                quantity=quantity,
                unit_price=Decimal(product.price)  # Ensure it's a Decimal
            ))

        OrderItem.objects.bulk_create(order_items)  # Optimized bulk insert

        return order
   

class CustomerSerializer(serializers.ModelSerializer):
    
    user = BaseUserSerializer()

    class Meta:
        model = Customer
        fields = ("id", "user")

class AddressSerializer(serializers.ModelSerializer):
    class Meta:
        model = Address
        fields = ['customer_id','name','latitude','longitude']

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

