from django.db.models.signals import post_save
from django.dispatch import receiver
from .models import Order, OrderLogs
from delivery.models import Delivery
from shop.models import ReturnRequest
from delivery.models import ReturnDelivery
from delivery.utils import assign_deliveries_to_drivers as assign_deliveries_to_drivers_util


@receiver(post_save, sender=Order)
def create_delivery_after_approval(sender, instance, created, **kwargs):
    # Check if there is already an active delivery for the order
    active_delivery_exists = Delivery.objects.filter(order=instance).exclude(status="F").exists()
    if not active_delivery_exists and instance.status == "Approved":
        Delivery.objects.create(
            order=instance
        )


@receiver(post_save, sender=ReturnRequest)
def create_return_delivery(sender, instance, **kwargs):
    """
    Creates a ReturnDelivery when ReturnRequest is approved
    and no existing delivery exists
    """
    if instance.status == 'APPROVED':
        # Check if delivery already exists
        if not hasattr(instance, 'return_delivery'):
            ReturnDelivery.objects.create(return_request=instance)


@receiver(post_save, sender=ReturnRequest)
def assign_deliveries_to_drivers(sender, instance, created, **kwargs):
    if instance.status == "APPROVED" :
        if not hasattr(instance, 'return_delivery'):
            print("Should Assign Deliveries")
            assign_deliveries_to_drivers_util()
    return      



@receiver(post_save, sender=Order)
def create_order_log(sender, instance, created, **kwargs):
    action = "Created" if created else "Updated"
    description = f"Order {action.lower()} with status {instance.status}"
    OrderLogs.objects.create(
        order=instance,
        action=action,
        description=description
    )