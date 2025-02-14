from rest_framework_simplejwt.views import TokenObtainPairView

from django.contrib.auth import get_user_model
from rest_framework.response import Response
from rest_framework.decorators import action
from rest_framework import viewsets, status
from sales.models import Price,Order
from warehouse.models import Product
from sales.serializers import CreateOrderSerializer, CustomerSerializer,ProductSerializer,OrderSerializer,OrderItemSerializer,InvoiceSerializer
from django.db import transaction
from .models import Customer, ReturnRequestItem, ReturnRequest
from .serializers import ReturnRequestSerializer, ReturnRequestItemSerializer, ConfirmOrderSerializer
from core.serializers import CustomerOrderSerializer


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
    serializer_class = CustomerOrderSerializer
    #permission_classes = [IsAuthenticated]

    def get_queryset(self):
        """Ensure customers only see their own orders."""
        customer = Customer.objects.get(user=self.request.user)
        return Order.objects.filter(customer=customer).prefetch_related("delivery__delivery_group")
    
    def get_serializer_class(self):
        if self.request.method == "POST":
            return ConfirmOrderSerializer
        return super().get_serializer_class()

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

class ReturnRequestViewSet(viewsets.ModelViewSet):
    queryset = ReturnRequest.objects.all()
    serializer_class = ReturnRequestSerializer

    @transaction.atomic
    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        self.perform_create(serializer)
        return Response(serializer.data, status=status.HTTP_201_CREATED)


class ReturnRequestItemViewSet(viewsets.ModelViewSet):
    queryset = ReturnRequestItem.objects.all()
    serializer_class = ReturnRequestItemSerializer

    def get_queryset(self):
        return self.queryset.filter(
            return_request_id=self.kwargs['return_request_pk']
        )

    def perform_create(self, serializer):
        serializer.save(
            return_request_id=self.kwargs['return_request_pk']
        )

