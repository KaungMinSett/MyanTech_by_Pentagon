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

    class Meta:
        model = OrderItem
        fields = ['order','product_id','quantity','unit_price']


class OrderSerializer(serializers.ModelSerializer):
    order_items = OrderItemSerializer(many=True)
    customer= serializers.PrimaryKeyRelatedField(queryset=Customer.objects.all())
    staff = serializers.PrimaryKeyRelatedField(queryset=Employee.objects.all())

    class Meta:
        model = Order
        fields = ['id', 'customer', 'staff', 'order_date', 'order_type', 'status', 'order_items']

    def create(self, validated_data):
        order_items_data = validated_data.pop('order_items')

        order = Order.objects.create(customer=validated_data['customer'], staff=validated_data['staff'],status='Approved', **validated_data)

        for item_data in order_items_data:
            OrderItem.objects.create(order=order, **item_data)

        return order


class PriceSerializer(serializers.ModelSerializer):
    class Meta:
        model= Price
        fields= '__all__'

class OrderLogsSerializer(serializers.ModelSerializer):
    class Meta:
        model = OrderLogs
        fields= '__all__'

class ProductSerializer(serializers.ModelSerializer):
    price = serializers.SerializerMethodField()
    available_stock = serializers.SerializerMethodField()
    class Meta:
        model = Product
        fields = ['id','name','category','brand','description','price','available_stock']

    def get_price(self, obj):
        # Fetch the first published price for the product
        price = Price.objects.filter(product_id__product=obj, is_published=True).first()
        return price.price if price else None

    def get_available_stock(self, obj):
        # Get the first available InventoryList record for the product
        inventory = InventoryList.objects.filter(product=obj).first()
        return inventory.quantity if inventory else 0
