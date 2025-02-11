
from rest_framework.response import Response
from rest_framework.viewsets import ModelViewSet

from rest_framework import status
from rest_framework.decorators import action
from . models import Order,Price,OrderLogs
from . serializers import OrderSerializer,OrderLogsSerializer,PriceSerializer

class OrderViewSet(ModelViewSet):
    queryset = Order.objects.all()
    serializer_class = OrderSerializer

    def get_queryset(self):
        """
        Optionally filter by customer or staff
        """
        queryset = super().get_queryset()
        customer_id = self.request.query_params.get('customer')
        staff_id = self.request.query_params.get('staff')

        if customer_id:
            queryset = queryset.filter(customer_id=customer_id)
        if staff_id:
            queryset = queryset.filter(staff_id=staff_id)

        return queryset

    @action(detail=True, methods=['post'])
    def approve_order(self, request, pk=None):
        """Manually approve an order (by staff)."""
        order = self.get_object()

        if order.status == 'Pending':
            order.approve()
            return Response({"message": "Order approved successfully"}, status=200)
        else:
            return Response({"message": "Order is already approved or cancelled."}, status=400)

class PriceViewSet(ModelViewSet):
    queryset = Price.objects.all()
    serializer_class = PriceSerializer

class OrderLogsViewSet(ModelViewSet):
    queryset = OrderLogs.objects.all()
    serializer_class = OrderLogsSerializer