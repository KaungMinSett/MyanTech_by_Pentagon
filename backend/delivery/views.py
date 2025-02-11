# views.py
from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
from .models import DeliveryGroup, Delivery
from .serializers import DeliveryGroupSerializer, DeliverySerializer
from warehouse.models import Warehouse

class DeliveryGroupViewSet(viewsets.ModelViewSet):
    queryset = DeliveryGroup.objects.all()
    serializer_class = DeliveryGroupSerializer

    @action(detail=False, methods=['post'], url_path='assign-deliveries')
    def assign_deliveries(self, request):
        """
        Endpoint to create delivery groups and assign deliveries
        Expects: { "warehouse_id": 1 }
        """
        warehouse_id = request.data.get('warehouse_id')
        
        try:
            DeliveryGroup.objects.create_delivery_groups(warehouse_id)
            return Response({"status": "Delivery groups created successfully"}, status=status.HTTP_201_CREATED)
        except Warehouse.DoesNotExist:
            return Response({"error": "Warehouse not found"}, status=status.HTTP_400_BAD_REQUEST)
        except ValueError as e:
            return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)
    
    @action(detail=True, methods=['post'], url_path='complete')
    def complete_group(self, request, pk=None):
        """Mark delivery group as completed"""
        group = self.get_object()
        group.status = DeliveryGroup.COMPLETE
        group.save()
        return Response({"status": "Delivery group marked as complete"})

class DeliveryViewSet(viewsets.ModelViewSet):
    queryset = Delivery.objects.all()
    serializer_class = DeliverySerializer

    @action(detail=True, methods=['post'], url_path='complete')
    def complete_delivery(self, request, pk=None):
        """Mark delivery as completed and update group location"""
        delivery = self.get_object()
        delivery.status = Delivery.COMPLETE
        delivery.save()
        
        # Update group location
        delivery.delivery_group.update_location()
        
        return Response({"status": "Delivery marked as complete"})

    @action(detail=False, methods=['post'], url_path='calculate-distances')
    def calculate_distances(self, request):
        """
        Calculate distances for all pending deliveries
        Expects: { "warehouse_id": 1 }
        """
        warehouse_id = request.data.get('warehouse_id')
        
        try:
            warehouse = Warehouse.objects.get(pk=warehouse_id)
            deliveries = Delivery.objects.filter(status=Delivery.PENDING)
            
            for delivery in deliveries:
                delivery.calculate_distance((warehouse.latitude, warehouse.longitude))
                
            return Response({"status": f"Calculated distances for {len(deliveries)} deliveries"})
        except Warehouse.DoesNotExist:
            return Response({"error": "Warehouse not found"}, status=400)