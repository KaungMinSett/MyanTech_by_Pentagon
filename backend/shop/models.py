from django.db import models
from django.conf import settings
from sales.models import Order, OrderItem
from django.core.exceptions import ValidationError
from hr.models import Employee



class Customer(models.Model):
    user = models.OneToOneField(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, null=True, blank=True)
    full_name= models.CharField(max_length=100)
    phone = models.CharField(max_length=15)
    is_registered = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.full_name

class Address(models.Model):
    customer = models.ForeignKey(Customer, on_delete=models.CASCADE, related_name="address")
    name = models.CharField(max_length=200)
    latitude = models.DecimalField(max_digits=9, decimal_places=6)
    longitude = models.DecimalField(max_digits=9, decimal_places=6)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.name}"
    






class ReturnRequest(models.Model):
    STATUS_CHOICES = [
        ('PENDING', 'Pending'),
        ('APPROVED', 'Approved'),
        ('REJECTED', 'Rejected'),
    ]
    
    customer = models.ForeignKey(Customer, on_delete=models.CASCADE)
    order = models.ForeignKey(Order, on_delete=models.CASCADE)
    issue_description = models.TextField()
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='PENDING')
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def clean(self):
        super().clean()
        # Check during model validation
        if self.pk and self.items.count() < 1:
            raise ValidationError("At least one return item is required")
  



    def __str__(self):
        return f"Return Request #{self.id} - {self.customer}"

class ReturnRequestItem(models.Model):
    return_request = models.ForeignKey(ReturnRequest, on_delete=models.CASCADE, related_name='items')
    order_item = models.ForeignKey(OrderItem, on_delete=models.CASCADE)
    quantity = models.PositiveIntegerField()

    def save(self, *args, **kwargs):
        # Prevent modifying items after parent is approved
        if self.return_request.status != 'PENDING':
            raise ValidationError("Cannot modify items after request is processed")
        super().save(*args, **kwargs)
    
    def clean(self):
        # Validate quantity doesn't exceed original order
        if self.quantity > self.order_item.quantity:
            raise ValidationError(
                f"Cannot return more than ordered ({self.order_item.quantity})"
            )
           
        if self.order_item.order != self.return_request.order:
            raise ValidationError(
                f"Item {self.order_item.id} does not belong to order {self.return_request.order.id}"
            )
        
        # Keep existing validations
        super().clean() 
    
    # def clean(self):
    #     if ReturnRequestItem.objects.filter(
    #         return_request=self.return_request,
    #         order_item=self.order_item
    #     ).exclude(pk=self.pk).exists():
    #         raise ValidationError("This item is already in the return request")
            
    def save(self, *args, **kwargs):
        self.full_clean()
        super().save(*args, **kwargs)
    
