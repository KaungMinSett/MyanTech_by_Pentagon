
from rest_framework.response import Response
from rest_framework.viewsets import ModelViewSet
from rest_framework import viewsets
from rest_framework import status
from rest_framework.decorators import action
from . models import Order,Price,OrderLogs,OrderItem
from . serializers import OrderSerializer,OrderLogsSerializer,PriceSerializer,CustomerSerializer,ProductSerializer
from shop.models import Customer
from warehouse.models import Product

class CustomerViewSet(ModelViewSet):
    queryset = Customer.objects.all()
    serializer_class = CustomerSerializer

class OrderViewSet(viewsets.ModelViewSet):
    #permission_classes = [IsAuthenticated, IsStaffUser]  # Ensure only authenticated staff can access

    queryset = Order.objects.all()
    serializer_class = OrderSerializer



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


