from rest_framework import serializers
from .models import Order,OrderItem,OrderLogs,Price
from shop.models import Address, Customer
from hr.models import Employee
from warehouse.models import Product

class OrderItemSerializer(serializers.ModelSerializer):
    class Meta:
        model = OrderItem
        fields = ['product_id','quantity','unit_price']

class OrderSerializer(serializers.ModelSerializer):
    items = OrderItemSerializer(many=True, read_only=True)
    customer_id = serializers.PrimaryKeyRelatedField(queryset=Customer.objects.all())
    staff_id = serializers.PrimaryKeyRelatedField(queryset=Employee.objects.all())
    address = serializers.PrimaryKeyRelatedField(queryset=Address.objects.all(), allow_null=True, required=False)
    custom_address = serializers.CharField(write_only=True, required=False, allow_blank=True)

    class Meta:
        model = Order
        fields = ['id', 'customer_id', 'address', 'custom_address', 'staff_id', 'order_date', 'order_type',
                  'status', 'items']

    def create(self, validated_data):
        # Create the Order instance
        order = Order.objects.create(**validated_data)
        return order
    def create_address(self, validated_data):
        custom_address = validated_data.pop('custom_address', None)
        customer = validated_data.get('customer')
        address = validated_data.get('address')

        # Create a new address if a custom address is provided
        if custom_address and not address:
            new_address = Address.objects.create(
                customer=customer,
                name=custom_address
            )
            validated_data['address'] = new_address

        return Order.objects.create(**validated_data)

    def update_address(self, instance, validated_data):
        custom_address = validated_data.pop('custom_address', None)

        if custom_address:
            new_address = Address.objects.create(
                customer=instance.customer,
                name=custom_address
            )
            instance.address = new_address  # Update order with new address

        return super().update(instance, validated_data)


class PriceSerializer(serializers.ModelSerializer):
    class Meta:
        model= Price
        fields= '__all__'

class OrderLogsSerializer(serializers.ModelSerializer):
    class Meta:
        model = OrderLogs
        fields= '__all__'



