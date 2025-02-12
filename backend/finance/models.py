from django.db import models
from delivery.models import DeliveryGroup
from django.conf import settings
from hr.models import Employee


# Create your models here.


class CashSubmission(models.Model):
    STATUS_CHOICES = [('PENDING', 'Pending'), ('VERIFIED', 'Verified')]
    
    delivery_group = models.OneToOneField(
        DeliveryGroup, 
        on_delete=models.CASCADE,
        related_name='cash_submission'
    )
    total_cash = models.DecimalField(
        max_digits=12, 
        decimal_places=2,
        editable=False  # Auto-calculated, not editable
    )
    status = models.CharField(
        max_length=20, 
        choices=STATUS_CHOICES, 
        default='PENDING'
    )
    verified_by = models.ForeignKey(
        Employee, 
        on_delete=models.SET_NULL, 
        null=True, 
        blank=True
    )
    verification_date = models.DateTimeField(null=True, blank=True)
    
    def __str__(self):
        return f"Cash Submission for {self.delivery_group}"