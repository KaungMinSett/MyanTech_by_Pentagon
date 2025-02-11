from rest_framework import serializers
from .models import Order,OrderItem,OrderLogs,Price
from shop.models import Address, Customer
from hr.models import Employee
from warehouse.models import Product,InventoryList


class AddressSerializer(serializers.ModelSerializer):
    class Meta:
        model = Address
        fields = ['name']
class CustomerSerializer(serializers.ModelSerializer):

    address = AddressSerializer(many=True)

    class Meta:
        model = Customer
        fields = ['id', 'full_name', 'phone', 'is_registered', 'address']

    def create(self, validated_data):
        address_data = validated_data.pop('address', [])

        customer = Customer.objects.create(**validated_data)

        for address in address_data:
            Address.objects.create(customer=customer, name=address['name'])

        return customer


class OrderItemSerializer(serializers.ModelSerializer):
    product_name = serializers.CharField(source="product_id.product_id.product.name", read_only=True)
    class Meta:
        model = OrderItem
        fields = ['id','order','product_id', 'product_name', 'quantity', 'unit_price', 'total_price']


class OrderSerializer(serializers.ModelSerializer):
    order_items = OrderItemSerializer(many=True)
    customer_id= serializers.PrimaryKeyRelatedField(queryset=Customer.objects.all())
    address = serializers.PrimaryKeyRelatedField(queryset=Address.objects.all())
    staff = serializers.PrimaryKeyRelatedField(queryset=Employee.objects.all())
    class Meta:
        model = Order
        fields = ['id', 'customer_id','address','staff', 'order_date', 'status', 'updated_at', 'order_items']

    def create(self, validated_data):
        order_items_data = validated_data.pop('order_items')

        order = Order.objects.create(status='Approved',
                                     order_type='phone', **validated_data)

        for item_data in order_items_data:
            OrderItem.objects.create(order=order, **item_data)

        return order

class InvoiceSerializer(serializers.ModelSerializer):
    customer_name = serializers.CharField(source="customer_id.full_name", read_only=True)
    total_order_price = serializers.DecimalField(max_digits=10, decimal_places=2, read_only=True)
    address = serializers.PrimaryKeyRelatedField(queryset=Address.objects.all())

    class Meta:
        model = Order
        fields = ['id', 'customer_id', 'customer_name','address', 'order_date', 'status', 'updated_at']

class PriceSerializer(serializers.ModelSerializer):
    class Meta:
        model= Price
        fields= '__all__'

class OrderLogsSerializer(serializers.ModelSerializer):
    class Meta:
        model = OrderLogs
        fields= '__all__'

class ProductSerializer(serializers.ModelSerializer):
    class Meta:
        model= Product
        fields = '__all__'