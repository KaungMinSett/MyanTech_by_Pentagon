from django.db import models
from shop.models import Customer, Address
from hr.models import Employee
# Create your models here.


class Order(models.Model):
    customer_id = models.ForeignKey(Customer, on_delete=models.CASCADE)
    staff_id = models.ForeignKey(Employee, on_delete=models.CASCADE)
    address = models.ForeignKey(Address, on_delete=models.SET_NULL, null=True, blank=True, related_name='orders')
    order_date = models.DateTimeField(auto_now=True)
    order_type = models.CharField(max_length=20, choices=[('phone', 'Phone'), ('website', 'Website')])
    status = models.CharField(max_length=20, choices=[
        ('Approved','Approved'),
        ('Cancelled', 'Cancelled')
    ])
    updated_at = models.DateTimeField(auto_now_add=True)

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

    def __str__(self):
        return f"Order {self.id} by {self.customer.full_name} on {self.order_date}"
