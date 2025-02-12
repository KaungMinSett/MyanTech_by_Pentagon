from rest_framework import serializers
from .models import DeliveryGroup, Delivery

class DeliverySerializer(serializers.ModelSerializer):
    class Meta:
        model = Delivery
        fields = '__all__'
        read_only_fields = ('created_at', 'last_updated_at')

class DeliveryUpdateSerializer(serializers.ModelSerializer):
    class Meta:
        model = Delivery
        fields = ['status']

class DeliveryGroupSerializer(serializers.ModelSerializer):
    deliveries = serializers.SerializerMethodField()

    class Meta:
        model = DeliveryGroup
        fields = '__all__'
        read_only_fields = ('created_at', 'last_updated_at', 'status')

    def get_deliveries(self, obj):
        # Use a nested serializer to avoid performance issues
        deliveries = obj.deliveries.all()
        return DeliverySerializer(deliveries, many=True).data