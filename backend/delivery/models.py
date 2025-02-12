from django.db import models
from warehouse.models import Warehouse
from hr.models import Employee
from sales.models import Order

class DeliveryGroup(models.Model):
    """
    Represents a group of deliveries assigned to a driver
    """
    # Status constants
    PENDING = "P"
    IN_PROGRESS = "I"
    COMPLETE = "C"
    FAILED = "F"
    STATUS_CHOICES = [
        (PENDING, "Pending"),
        (IN_PROGRESS, "In progress"),
        (COMPLETE, "Complete"),
        (FAILED, "Failed"),
    ]
    
    # Relationships
    warehouse = models.ForeignKey(Warehouse, on_delete=models.CASCADE)
    employee = models.ForeignKey(Employee, on_delete=models.CASCADE)
    
    # Tracking fields
    status = models.CharField(max_length=1, choices=STATUS_CHOICES, default=PENDING)
    latitude = models.DecimalField(max_digits=9, decimal_places=6, null=True, blank=True)   # Current location
    longitude = models.DecimalField(max_digits=9, decimal_places=6, null=True, blank=True)  # Current location
    
    # Timestamps
    created_at = models.DateTimeField(auto_now_add=True)
    last_updated_at = models.DateTimeField(auto_now=True)
    
    def __str__(self):
        return f"Delivery Group {self.id} - {self.status}"

class Delivery(models.Model):
    """
    Represents an individual delivery order
    """
    # Status constants
    PENDING = "P"
    ASSIGNED = "A"
    COMPLETE = "C"
    FAILED = "F"
    STATUS_CHOICES = [
        (PENDING, "Pending"),
        (ASSIGNED, "Assigned"),
        (COMPLETE, "Complete"),
        (FAILED, "Failed"),
    ]
    
    # Relationships
    delivery_group = models.ForeignKey(DeliveryGroup, on_delete=models.CASCADE, null=True, blank=True, related_name="deliveries")
    order = models.OneToOneField(Order, on_delete=models.CASCADE, related_name="delivery")
    
    # Delivery details
    status = models.CharField(max_length=1, choices=STATUS_CHOICES, default=PENDING)
    remark = models.TextField(max_length=255, blank=True)  # Delivery notes
    
    # Timestamps
    created_at = models.DateTimeField(auto_now_add=True)
    last_updated_at = models.DateTimeField(auto_now=True)
    
    def __str__(self):
        return f"Delivery {self.id} - {self.status}"