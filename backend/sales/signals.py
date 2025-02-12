from django.db.models.signals import post_save
from django.dispatch import receiver
from .models import Order, OrderLogs
from delivery.models import Delivery

@receiver(post_save, sender=Order)
def create_delivery_after_approval(sender, instance, created, **kwargs):
    # Check if there is already an active delivery for the order
    active_delivery_exists = Delivery.objects.filter(order=instance).exclude(status="F").exists()
    if not active_delivery_exists and instance.status == "Approved":
        Delivery.objects.create(
            order=instance
        )

@receiver(post_save, sender=Order)
def create_order_log(sender, instance, created, **kwargs):
    action = "Created" if created else "Updated"
    description = f"Order {action.lower()} with status {instance.status}"
    OrderLogs.objects.create(
        order=instance,
        action=action,
        description=description
    )