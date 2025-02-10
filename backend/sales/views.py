from rest_framework import viewsets
from rest_framework.permissions import IsAuthenticated
from .models import Order
from .serializers import OrderSerializer

class OrderViewSet(viewsets.ModelViewSet):
    queryset = Order.objects.all()
    serializer_class = OrderSerializer
    permission_classes = [IsAuthenticated]

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
