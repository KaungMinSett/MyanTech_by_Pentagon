from django.db import models
from shop.models import Customer, Address
from hr.models import Employee
from warehouse.models import Product
# Create your models here.

# Create your models here.

class Price(models.Model):
    product_id = models.ForeignKey(Product, on_delete=models.CASCADE, null=True)
    price = models.DecimalField(max_digits=10, decimal_places=2)
    is_published = models.BooleanField(default=False)


class Order(models.Model):
    customer_id = models.ForeignKey(Customer, on_delete=models.CASCADE)
    address = models.ForeignKey(Address, on_delete=models.SET_NULL, null=True, blank=True,related_name='orders')
    staff_id = models.ForeignKey(Employee, on_delete=models.CASCADE)
    order_date = models.DateTimeField(auto_now=True)
    order_type = models.CharField(max_length=20, choices=[('phone', 'Phone'), ('website', 'Website')])
    status = models.CharField(max_length=20, choices=[
        ('Pending','Pending'),
        ('Approved','Approved')
    ])
    created_at= models.DateTimeField(auto_now=True)
    updated_at =models.DateTimeField(auto_now_add=True)

    def save(self, *args, **kwargs):
        # If a new address is provided, save it and link it to the customer
        if self.custom_address and not self.address:
            new_address = Address.objects.create(
                customer=self.customer,
                name=self.custom_address
            )
            self.address = new_address  # Link new address
            self.custom_address = None  # Clear manual input after saving
        super().save(*args, **kwargs)

    def approve(self):
        if self.status=='Pending':
            self.status ='Approved'
            self.save(update_fields=['status'])

    def __str__(self):
        return f"Order {self.id} by {self.customer.full_name} on {self.order_date}"
class OrderItem(models.Model):
    order = models.ForeignKey(Order, on_delete=models.CASCADE, related_name="items")
    product_id = models.ForeignKey(Product,on_delete=models.CASCADE)
    quantity = models.PositiveIntegerField()
    unit_price = models.DecimalField(max_digits=10, decimal_places=2)

    def __str__(self):
        return f"Item {self.id} in Order {self.order.id}"

class OrderLogs(models.Model):
    order_id =models.ForeignKey(Order, on_delete=models.CASCADE)
    action = models.TextField()
    description = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)