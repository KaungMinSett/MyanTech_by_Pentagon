from django.db import models
from warehouse.models import Warehouse
from hr.models import Employee
from sales.models import Order
from django.core.exceptions import ValidationError
from shop.models import ReturnRequest

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
    
    def clean(self):
        if self.pk is not None:  # Check if the object already exists in the database
            old_status = DeliveryGroup.objects.get(pk=self.pk).status
            valid_transitions = {
                self.PENDING: [self.IN_PROGRESS, self.FAILED, self.PENDING],
                self.IN_PROGRESS: [self.COMPLETE, self.FAILED, self.IN_PROGRESS],
                self.COMPLETE: [],
                self.FAILED: []
            }
            if self.status not in valid_transitions[old_status]:
                raise ValidationError(f"Invalid status transition from {old_status} to {self.status}")
            
            if self.status == self.COMPLETE:
                incomplete_deliveries = self.deliveries.exclude(status__in=[Delivery.COMPLETE, Delivery.FAILED]).exists()
                if incomplete_deliveries:
                    raise ValidationError("Cannot set DeliveryGroup status to Complete when there are incomplete deliveries.")
    
    def save(self, *args, **kwargs):
        self.clean()
        super().save(*args, **kwargs)

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
    delivery_group = models.ForeignKey(DeliveryGroup, on_delete=models.SET_NULL, null=True, blank=True, related_name="deliveries")
    order = models.ForeignKey(Order, on_delete=models.CASCADE, related_name="delivery")
    
    # Delivery details
    status = models.CharField(max_length=1, choices=STATUS_CHOICES, default=PENDING)
    remark = models.TextField(max_length=255, blank=True)  # Delivery notes
    
    # Timestamps
    created_at = models.DateTimeField(auto_now_add=True)
    last_updated_at = models.DateTimeField(auto_now=True)
    
    def __str__(self):
        return f"Delivery {self.id} - {self.status}"
    
    def clean(self):
        if self.pk is not None:  # Check if the object already exists in the database
            old_status = Delivery.objects.get(pk=self.pk).status
            valid_transitions = {
                self.PENDING: [self.ASSIGNED, self.FAILED, self.PENDING],
                self.ASSIGNED: [self.COMPLETE, self.FAILED, self.ASSIGNED],
                self.COMPLETE: [],
                self.FAILED: []
            }
            if self.status not in valid_transitions[old_status]:
                print(old_status)
                raise ValidationError(f"Invalid status transition from {old_status} to {self.status}")
    
    def save(self, *args, **kwargs):
        self.clean()
        super().save(*args, **kwargs)


class ReturnDelivery(models.Model):
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
    
   
    return_request = models.OneToOneField(
        ReturnRequest,
        on_delete=models.CASCADE,
        related_name='collection'
    )
    delivery_group = models.ForeignKey(DeliveryGroup, on_delete=models.SET_NULL, null=True, blank=True, related_name="returned")
 
    
   
    status = models.CharField(
        max_length=20,
        choices=STATUS_CHOICES,
        default='PENDING'
    )
    notes = models.TextField(blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"Return for {self.return_request}"