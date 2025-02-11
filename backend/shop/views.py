from rest_framework_simplejwt.views import TokenObtainPairView
from .models import Customer
from django.contrib.auth import get_user_model
from rest_framework.response import Response
from rest_framework.decorators import action
from rest_framework import viewsets, status
from sales.models import Price,Order
from warehouse.models import Product
from sales.serializers import CustomerSerializer,ProductSerializer,OrderSerializer,OrderItemSerializer,InvoiceSerializer

User = get_user_model()

class CustomerViewSet(viewsets.ModelViewSet):
    queryset = Customer.objects.all()
    permission_classes = []
    
    def get_serializer_class(self):
        return CustomerSerializer

class CustomerLoginView(TokenObtainPairView):
    
    permission_classes = []
    
    def post(self, request, *args, **kwargs):
        response = super().post(request, *args, **kwargs)
        user = User.objects.get(username=request.data['username'])
        if not user.is_staff and Customer.objects.filter(user=user).exists():
            return response
        else:
            return Response({'error': 'Employee credentials are not allowed'}, status=403)

class OrderViewSet(viewsets.ModelViewSet):
    serializer_class = OrderSerializer
    #permission_classes = [IsAuthenticated]

    def get_queryset(self):
        """Ensure customers only see their own orders."""
        return Order.objects.filter(customer_id=self.request.user.customer_id)

    @action(detail=True, methods=['get'])
    def order_summary(self, request, pk=None):
        """View order details along with selected order items."""
        order = self.get_object()
        serializer = OrderSerializer(order)
        return Response(serializer.data)

    @action(detail=True, methods=['get'])
    def invoice(self, request, pk=None):
        """View invoice only if the order is approved."""
        order = self.get_object()
        if order.status != 'Approved':
            return Response({"error": "Invoice is only available for approved orders."}, status=400)
        serializer = InvoiceSerializer(order)
        return Response(serializer.data)