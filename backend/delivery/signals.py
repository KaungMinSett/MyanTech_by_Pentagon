from django.db.models.signals import post_save
from django.dispatch import receiver
from django.db import transaction
from .models import Delivery
from .utils import assign_deliveries_to_drivers as assign_deliveries_to_drivers_util

@receiver(post_save, sender=Delivery)
def assign_deliveries_to_drivers(sender, instance, created, **kwargs):
    
    if not created or instance.status != "P":
        return
    assign_deliveries_to_drivers_util()


@receiver(post_save, sender=Delivery)
def update_order_status(sender, instance, **kwargs):
    if instance.status == 'C':  # Completed
        with transaction.atomic():
            # Update the linked order status
            order = instance.order
            order.status = 'Delivered'  # Assuming Order has a 'status' field
            order.save()

            # Update the delivery group's latitude and longitude (if needed)
            if instance.delivery_group:
                instance.delivery_group.latitude = instance.order.address.latitude
                instance.delivery_group.longitude = instance.order.address.longitude
                instance.delivery_group.save()