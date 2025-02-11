
from rest_framework.response import Response
from rest_framework.viewsets import ModelViewSet
from rest_framework import viewsets
from rest_framework import status
from rest_framework.decorators import action
from . models import Order,Price,OrderLogs,OrderItem
from . serializers import OrderSerializer,OrderLogsSerializer,PriceSerializer,CustomerSerializer,InvoiceSerializer,ProductSerializer
from shop.models import Customer
from warehouse.models import Product

class CustomerViewSet(ModelViewSet):
    queryset = Customer.objects.all()
    serializer_class = CustomerSerializer

class OrderViewSet(viewsets.ModelViewSet):
    #permission_classes = [IsAuthenticated, IsStaffUser]

    queryset = Order.objects.all()
    serializer_class = OrderSerializer

    def update(self, request, *args, **kwargs):
        order = self.get_object()  # Get the specific order object

        if order.status == 'Pending' and request.data.get('status') == 'Approved':
            order.status = 'Approved'
            order.save()
            invoice_created_at = order.created_at

            return Response({
                'message': 'Order approved',
                'invoice_created_at': invoice_created_at
            }, status=status.HTTP_200_OK)

        elif request.data.get('status') == 'Cancelled':
            order.status = 'Cancelled'
            order.save()

            return Response({'message': 'Order has been cancelled'}, status=status.HTTP_200_OK)

        # Handle other status transitions or return an error if the action is invalid
        return Response({'error': 'Invalid action or order status'}, status=status.HTTP_400_BAD_REQUEST)

    @action(detail=True, methods=['get'])
    def order_summary(self, request, pk=None):

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

class PriceViewSet(ModelViewSet):
    queryset = Price.objects.all()
    serializer_class = PriceSerializer

class OrderLogsViewSet(ModelViewSet):
    queryset = OrderLogs.objects.all()
    serializer_class = OrderLogsSerializer

class AvailableProductListView(viewsets.ReadOnlyModelViewSet):

    serializer_class = ProductSerializer

    def get_queryset(self):
        # Get products that have a published price
        published_product_ids = Price.objects.filter(is_published=True).values_list('product_id__product', flat=True)

        # Filter only products that exist in the published list
        return Product.objects.filter(id__in=published_product_ids)


