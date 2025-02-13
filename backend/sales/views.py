
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



# class OrderViewSet(viewsets.ModelViewSet):
#     #permission_classes = [IsAuthenticated, IsStaffUser]

#     queryset = Order.objects.all()
#     serializer_class = OrderSerializer

#     def update(self, request, *args, **kwargs):
#         order = self.get_object()  # Get the specific order object

#         if order.status == 'Pending' and request.data.get('status') == 'Approved':
#             order.status = 'Approved'
#             order.save()
#             invoice_created_at = order.created_at

#             return Response({
#                 'message': 'Order approved',
#                 'invoice_created_at': invoice_created_at
#             }, status=status.HTTP_200_OK)

#         elif request.data.get('status') == 'Cancelled':
#             order.status = 'Cancelled'
#             order.save()

#             return Response({'message': 'Order has been cancelled'}, status=status.HTTP_200_OK)

#         # Handle other status transitions or return an error if the action is invalid
#         return Response({'error': 'Invalid action or order status'}, status=status.HTTP_400_BAD_REQUEST)

#     @action(detail=True, methods=['get'])
#     def order_summary(self, request, pk=None):

#         order = self.get_object()
#         serializer = OrderSerializer(order)
#         return Response(serializer.data)

#     @action(detail=True, methods=['get'])
#     def invoice(self, request, pk=None):
#         """View invoice only if the order is approved."""
#         order = self.get_object()
#         if order.status != 'Approved':
#             return Response({"error": "Invoice is only available for approved orders."}, status=400)
#         serializer = InvoiceSerializer(order)
#         return Response(serializer.data)

class OrderViewSet(viewsets.ModelViewSet):
    queryset = Order.objects.prefetch_related('order_items').all()
    serializer_class = OrderSerializer

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        
        # Manually handle order items creation
        order = self.perform_create(serializer)
        headers = self.get_success_headers(serializer.data)
        
        # Return full order details with items
        response_serializer = OrderSerializer(order)
        return Response(
            response_serializer.data,
            status=status.HTTP_201_CREATED,
            headers=headers
        )

    def perform_create(self, serializer):
        order_items_data = serializer.validated_data.pop('order_items')
        order = serializer.save()
        
        for item_data in order_items_data:
            # Auto-populate unit_price if missing
            if 'unit_price' not in item_data:
                item_data['unit_price'] = item_data['product'].price
                
            OrderItem.objects.create(order=order, **item_data)
            
        return order
    
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


