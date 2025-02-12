from django.db import models
from shop.models import Customer, Address
from hr.models import Employee
from warehouse.models import InventoryList
from django.db.models import Sum, F, Value
from django.db.models.functions import Coalesce
from django.db.models import DecimalField
from decimal import Decimal
# Create your models here.



class Price(models.Model):
    product = models.ForeignKey(InventoryList, on_delete=models.CASCADE)
    price = models.DecimalField(max_digits=10, decimal_places=2)
    is_published = models.BooleanField(default=False)
    image = models.ImageField(
        upload_to='product_images/',  # Images stored in MEDIA_ROOT/
        blank=True,  # Optional field
        null=True,   # Allow NULL in database
    )

    def get_available_stock(self):

        product = self.product
        return product.quantity

class Order(models.Model):
    RECONCILIATION_STATUS = [('PENDING', 'Pending'), ('CONFIRMED', 'Confirmed')]
    customer = models.ForeignKey('shop.Customer', on_delete=models.CASCADE, related_name='orders')
    address = models.ForeignKey('shop.Address',on_delete=models.CASCADE)
    employee = models.ForeignKey(Employee, on_delete=models.CASCADE,null=True)
    order_date = models.DateTimeField(auto_now=True)
    order_type = models.CharField(max_length=20, choices=[('phone', 'Phone'), ('website', 'Website')])
    status = models.CharField(max_length=20, choices=[
        ('Pending','Pending'),
        ('Approved','Approved'),
        ('Cancelled','Cancelled')
    ], default="Pending")
    created_at= models.DateTimeField(auto_now_add=True)
    updated_at =models.DateTimeField(auto_now=True)

    def approve(self):
        if self.status=='Pending':
            self.status ='Approved'
            self.save(update_fields=['status'])

    def get_total_price(self):
        """
        Calculates total order value using Django's ORM aggregation
        Handles empty orders with Coalesce
        """
       
        return self.order_items.aggregate(
            total_price=Coalesce(
                Sum(F('quantity') * F('unit_price')),
                Value(Decimal('0.00')),
                output_field=DecimalField(max_digits=10, decimal_places=2)
            )
        )['total_price']

    def __str__(self):
        return f"Order {self.id}  on {self.order_date}"
    
class OrderItem(models.Model):
    order = models.ForeignKey(Order, on_delete=models.CASCADE, related_name="order_items")
    product = models.ForeignKey(Price,on_delete=models.PROTECT)
    quantity = models.PositiveIntegerField()
    unit_price = models.DecimalField(max_digits=10, decimal_places=2)

    def __str__(self):
        return f"Item {self.id} in Order {self.order.id}"

    def total_price(self):
        return self.product.price * self.quantity

class OrderLogs(models.Model):
    order =models.ForeignKey(Order, on_delete=models.CASCADE)
    action = models.TextField()
    description = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)


