from rest_framework import serializers
from .models import Order
from shop.models import Address, Customer
from hr.models import Employee


class OrderSerializer(serializers.ModelSerializer):
    customer = serializers.PrimaryKeyRelatedField(queryset=Customer.objects.all())
    staff = serializers.PrimaryKeyRelatedField(queryset=Employee.objects.all())
    address = serializers.PrimaryKeyRelatedField(queryset=Address.objects.all(), allow_null=True, required=False)
    custom_address = serializers.CharField(write_only=True, required=False, allow_blank=True)

    class Meta:
        model = Order
        fields = ['id', 'customer', 'staff', 'address', 'custom_address', 'order_date', 'order_type', 'status', 'total_amount', 'updated_at']
        read_only_fields = ['order_date', 'updated_at']

    def create(self, validated_data):
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

    def update(self, instance, validated_data):
        custom_address = validated_data.pop('custom_address', None)

        if custom_address:
            new_address = Address.objects.create(
                customer=instance.customer,
                name=custom_address
            )
            instance.address = new_address  # Update order with new address

        return super().update(instance, validated_data)
