# views.py
from rest_framework import viewsets, status
from rest_framework.response import Response
from rest_framework.decorators import action
from .models import DeliveryGroup, Delivery
from .serializers import *
from django.db.models import Count

class DeliveryGroupViewSet(viewsets.ModelViewSet):
    queryset = DeliveryGroup.objects.all()
    serializer_class = DeliveryGroupSerializer

    @action(detail=False, methods=['post'])
    def trigger_delivery_assignment(self, request):
        """
        Custom action to trigger delivery assignment process
        """
        try:
            warehouse_id = request.data.get('warehouse_id')
            DeliveryGroup.objects.create_delivery_groups(warehouse_id)
            return Response({"message": "Delivery assignment process triggered"}, status=status.HTTP_200_OK)
        except ValueError as e:
            return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)

class DeliveryViewSet(viewsets.ModelViewSet):
    queryset = Delivery.objects.all()
    serializer_class = DeliverySerializer

    @action(detail=True, methods=['patch'])
    def update_status(self, request, pk=None):
        """
        Custom action for drivers to update order status
        """
        delivery = self.get_object()
        status = request.data.get('status')
        if status not in [Delivery.PENDING, Delivery.IN_PROGRESS, Delivery.COMPLETE]:
            return Response({"error": "Invalid status"}, status=status.HTTP_400_BAD_REQUEST)
        delivery.status = status
        delivery.save()
        return Response({"message": "Order status updated"}, status=status.HTTP_200_OK)

    @action(detail=False, methods=['get'])
    def assigned_groups(self, request):
        """
        Custom action for drivers to get assigned delivery groups
        """
        employee_id = request.query_params.get('employee_id')
        groups = DeliveryGroup.objects.filter(employee_id=employee_id)
        serializer = self.get_serializer(groups, many=True)
        return Response(serializer.data)

    @action(detail=False, methods=['get'])
    def deliveries(self, request):
        """
        Custom action for drivers to get deliveries within an assigned group
        """
        delivery_group_id = request.query_params.get('delivery_group_id')
        deliveries = Delivery.objects.filter(delivery_group_id=delivery_group_id)
        serializer = self.get_serializer(deliveries, many=True)
        return Response(serializer.data)
