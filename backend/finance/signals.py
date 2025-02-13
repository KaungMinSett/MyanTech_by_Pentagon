from django.db.models.signals import post_save
from django.dispatch import receiver
from django.db import transaction
from .models import DeliveryGroup, CashSubmission
from sales.models import Order
from django.db.models import DecimalField
from decimal import Decimal
from django.db.models import Sum, F,Value
from django.db.models.functions import Coalesce
from delivery.models import Delivery
from django.db.models import Q



@receiver(post_save, sender=DeliveryGroup)
def handle_completed_delivery_group(sender, instance, **kwargs):
    if instance.status == DeliveryGroup.COMPLETE and not hasattr(instance, 'cash_submission'):
        with transaction.atomic():
            # Calculate total for COMPLETED deliveries only
            total = instance.deliveries.filter(status=Delivery.COMPLETE).aggregate(
                total_cash=Coalesce(
                    Sum(
                        F('order__order_items__quantity') * F('order__order_items__unit_price')
                    ),
                    Value(Decimal('0.00')),
                    output_field=DecimalField(max_digits=10, decimal_places=2)
                )
            )['total_cash']

            CashSubmission.objects.create(
                delivery_group=instance,
                total_cash=total
            )
        

@receiver(post_save, sender=CashSubmission)
def update_order_reconciliation(sender, instance, **kwargs):
    """
    Updates order reconciliation status when cash submission is verified
    (Only for orders with completed deliveries)
    """
    print(f"Signal triggered for CashSubmission {instance.id}")
    
    if instance.status == 'VERIFIED':
        # Get orders with COMPLETED deliveries in this delivery group
        orders = Order.objects.filter(
            Q(delivery__delivery_group=instance.delivery_group) &
            Q(delivery__status=Delivery.COMPLETE)  # Only completed deliveries
        )
        
        # Bulk update for efficiency
        orders.update(reconciliation_status='CONFIRMED')
        print(f"Updated {orders.count()} orders with completed deliveries")