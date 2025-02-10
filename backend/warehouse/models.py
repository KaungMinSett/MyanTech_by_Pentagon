from django.db import models

# Create your models here.
from django.conf import settings
from django.utils import timezone

class Brand(models.Model):
    id = models.AutoField(primary_key=True)
    name = models.CharField(max_length=100, unique=True)

    def __str__(self):
        return self.name

class Category(models.Model):
     id = models.AutoField(primary_key=True)
     name = models.CharField(max_length=100, unique=True)
     
     def __str__(self):
        return self.name

class Warehouse(models.Model):
    id = models.AutoField(primary_key=True)
    name = models.CharField(max_length=100, unique=True)
    address = models.CharField(max_length=200)

    def __str__(self):
        return f"{self.name} - {self.address}"


class InventoryList(models.Model):
    product = models.ForeignKey('Product', on_delete=models.CASCADE)
    warehouse = models.ForeignKey('Warehouse', on_delete=models.CASCADE)
    quantity = models.PositiveIntegerField(default=0)

    class Meta:
        # Ensure a product can only have one entry per warehouse
        unique_together = ('product', 'warehouse')

    def __str__(self):
        return f"{self.product.name} in {self.warehouse.name}: {self.quantity} units"



class Product(models.Model):
    id = models.AutoField(primary_key=True)
    name = models.CharField(max_length=200)
    category = models.ForeignKey('Category', on_delete=models.CASCADE)
    brand = models.ForeignKey('Brand', on_delete=models.CASCADE)
    description = models.TextField(blank=True, null=True)  # optional 

    def total_quantity(self):
        """Total quantity of this product across all warehouses."""
        return InventoryList.objects.filter(product=self).aggregate(total=models.Sum('quantity'))['total'] or 0

    def quantity_in_warehouse(self, warehouse):
        """Quantity of this product in a specific warehouse."""
        try:
            return InventoryList.objects.get(product=self, warehouse=warehouse).quantity
        except InventoryList.DoesNotExist:
            return 0
   

    def __str__(self):
        return self.name
    





class Inbound(models.Model):
    STATUS_CHOICES = [
        ('pending', 'Pending'),
        ('approved', 'Approved'),
        ('declined', 'Declined'),
    ]
    product = models.ForeignKey('Product', on_delete=models.CASCADE)
    warehouse = models.ForeignKey('Warehouse', on_delete=models.CASCADE)
    
    quantity = models.PositiveIntegerField()
    status = models.CharField(max_length=10, choices=STATUS_CHOICES, default='pending')
    created_by = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='product_requests')
    resolved_by = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.SET_NULL, null=True, blank=True, related_name='resolved_requests')
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"{self.product} ({self.status})"






class Outbound(models.Model):
    OUTBOUND_REASONS = [
        ('SALE', 'Sale'),
        ('TRANSFER', 'Transfer to Another Warehouse'),
        ('RETURN', 'Return to Supplier'),
        ('DAMAGED', 'Damaged/Disposed'),
    ]

    product = models.ForeignKey('Product', on_delete=models.CASCADE, related_name='outbounds')
    warehouse = models.ForeignKey('Warehouse', on_delete=models.CASCADE, related_name='outbounds')
    quantity = models.PositiveIntegerField()
    reason = models.CharField(max_length=20, choices=OUTBOUND_REASONS)
    timestamp = models.DateTimeField(default=timezone.now)
    staff = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.SET_NULL, null=True)  # Track staff member

    def __str__(self):
        return f"{self.product.name} - {self.quantity} units ({self.reason})"



    



