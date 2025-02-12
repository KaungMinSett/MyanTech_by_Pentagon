from django.db.models.signals import post_save
from django.dispatch import receiver
from django.db import transaction
from .models import DeliveryGroup, CashSubmission
from sales.models import Order
from django.db.models import DecimalField
from decimal import Decimal
from django.db.models import Sum, F,Value
from django.db.models.functions import Coalesce

@receiver(post_save, sender=DeliveryGroup)
def handle_completed_delivery_group(sender, instance, **kwargs):
    """
    Automatically creates cash submission when delivery group is marked complete
    """
    if instance.status == DeliveryGroup.COMPLETE:
        # Prevent duplicate submissions
        if not hasattr(instance, 'cash_submission'):
            with transaction.atomic():
                   # Calculate total using Django's ORM aggregation (not Python sum())
                total = instance.deliveries.aggregate(
                total_cash=Coalesce(
                    Sum(F('order__order_items__quantity') * F('order__order_items__unit_price')),
                    Value(Decimal('0.00')),
                    output_field=DecimalField(max_digits=10, decimal_places=2)
                )
            )['total_cash']
                
                
                #create cash submission
                CashSubmission.objects.create(
                    delivery_group=instance,
                    total_cash=total
                )
        
@receiver(post_save, sender=CashSubmission)
def update_order_reconciliation(sender, instance, **kwargs):
    """
    Updates order reconciliation status when cash submission is verified
    """
    print(f"Signal triggered for CashSubmission {instance.id}")
    if instance.status == 'VERIFIED':
        # Get all orders linked to this delivery group
        orders = Order.objects.filter(
            delivery__delivery_group=instance.delivery_group
        )
        
        # Bulk update for efficiency
        orders.update(reconciliation_status='CONFIRMED')