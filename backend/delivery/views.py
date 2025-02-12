from rest_framework import viewsets
from rest_framework.response import Response
from rest_framework.exceptions import MethodNotAllowed
from rest_framework.decorators import action
from .models import DeliveryGroup, Delivery
from .serializers import DeliveryGroupSerializer, DeliverySerializer, DeliveryUpdateSerializer
from .utils import assign_deliveries_to_drivers

class DeliveryGroupViewSet(viewsets.ModelViewSet):
    queryset = DeliveryGroup.objects.prefetch_related('deliveries').all()
    serializer_class = DeliveryGroupSerializer
    
    def create(self, request, *args, **kwargs):
        raise MethodNotAllowed('POST', detail="Creating DeliveryGroup via POST is not allowed.")

    @action(detail=False, methods=['post'])
    def delivery_assignment(self, request):
        assign_deliveries_to_drivers()
        return Response({"message": "Deliveries assigned successfully."}, status=200)

class DeliveryViewSet(viewsets.ModelViewSet):
    serializer_class = DeliverySerializer
    
    def get_queryset(self):
        # Filter deliveries based on the nested delivery group
        deliverygroup_id = self.kwargs.get('deliverygroup_pk')
        if deliverygroup_id:
            return Delivery.objects.filter(delivery_group_id=deliverygroup_id)
        return Delivery.objects.none()  # Return empty queryset if no deliverygroup_pk is provided

    def get_serializer_class(self):
        if self.action in ['update', 'partial_update']:
            return DeliveryUpdateSerializer
        return super().get_serializer_class()

    def create(self, request, *args, **kwargs):
        raise MethodNotAllowed('POST', detail="Creating Delivery via POST is not allowed.")

    @action(detail=True, methods=['patch'])
    def complete(self, request, pk=None):
        """
        Custom action for drivers to update order status
        """
        delivery = self.get_object()
        status = request.data.get('status')
        if status not in [Delivery.PENDING, Delivery.IN_PROGRESS, Delivery.COMPLETE]:
            return Response({"error": "Invalid status"}, status=400)
        delivery.status = status
        delivery.save()
        return Response({"message": "Order status updated"}, status=200)