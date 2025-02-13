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
    product = serializers.PrimaryKeyRelatedField(
        queryset=Price.objects.all(),
        help_text="Select product from available prices"
    )
    
    class Meta:
        model = OrderItem
        fields = ['id', 'product', 'quantity', 'unit_price']
        extra_kwargs = {
            'unit_price': {
                'required': False,
                'help_text': "Will auto-populate from product price if not provided"
            }
        }

class OrderSerializer(serializers.ModelSerializer):
    order_items = OrderItemSerializer(
        many=True,
        required=True,
        help_text="At least one order item is required"
    )

    class Meta:
        model = Order
        fields = [
            'id', 'customer', 'address', 'order_type', 
            'status', 'order_items', 'created_at'
        ]
        read_only_fields = ['status', 'created_at']

# class OrderSerializer(serializers.ModelSerializer):
#     order_items = OrderItemSerializer(many=True)
#     customer_id= serializers.PrimaryKeyRelatedField(queryset=Customer.objects.all())
#     address = serializers.PrimaryKeyRelatedField(queryset=Address.objects.all())
#     staff = serializers.PrimaryKeyRelatedField(queryset=Employee.objects.all())
#     class Meta:
#         model = Order
#         fields = ['id', 'customer_id','address','staff', 'order_date', 'status', 'updated_at', 'order_items']

#     def create(self, validated_data):
#         order_items_data = validated_data.pop('order_items')

#         order = Order.objects.create(status='Approved',
#                                      order_type='phone', **validated_data)

#         for item_data in order_items_data:
#             OrderItem.objects.create(order=order, **item_data)

#         return order

class OrderSerializer(serializers.ModelSerializer):
    order_items = OrderItemSerializer(many=True)
    
    class Meta:
        model = Order
        fields = '__all__'
        read_only_fields = ['total_price', 'reconciliation_status']

    def validate_order_items(self, value):
        if not value:
            raise serializers.ValidationError("At least one order item is required")
        return value

    def create(self, validated_data):
        order_items_data = validated_data.pop('order_items')
        order = Order.objects.create(**validated_data)
        
        for item_data in order_items_data:
            # Auto-populate unit_price from product price if not provided
            if 'unit_price' not in item_data:
                item_data['unit_price'] = item_data['product'].price
                
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