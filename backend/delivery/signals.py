from django.db.models.signals import post_save
from django.dispatch import receiver
from django.db import transaction
from .models import Delivery, DeliveryGroup
from sales.models import Order
from .utils import assign_deliveries_to_drivers as assign_deliveries_to_drivers_util

@receiver(post_save, sender=Order)
def assign_deliveries_to_drivers(sender, instance, created, **kwargs):
    if instance.status == "Approved" and instance.warehouse_ready:
        print("Should Assign Deliveries")
        assign_deliveries_to_drivers_util()
    return      

@receiver(post_save, sender=Delivery)
def update_order_status_after_delivery(sender, instance, created, **kwargs):
    print("updated order status")
    if instance.status == Delivery.COMPLETE:  # Completed
        print("Delivery Completed")
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
    elif instance.status == Delivery.FAILED:
        print("created a new delivery record for this failure")
        Delivery.objects.create(
            order=instance.order
        )

@receiver(post_save, sender=DeliveryGroup)
def set_deliveries_to_failed(sender, instance, created, **kwargs):
    if instance.status == DeliveryGroup.FAILED:
        print("Should set all deliveries to failed")
        # Set all related deliveries without 'Complete' status to 'Failed's
        Delivery.objects.filter(delivery_group=instance).exclude(status=Delivery.COMPLETE).update(status=Delivery.FAILED)
        
        # Recreate delivery records for failed deliveries
        failed_deliveries = Delivery.objects.filter(delivery_group=instance, status=Delivery.FAILED)
        for delivery in failed_deliveries:
            # Check if there is already an active delivery for the order
            active_delivery_exists = Delivery.objects.filter(order=delivery.order).exclude(status="F").exists()
            if not active_delivery_exists:
                # Create a new delivery for the order whose delivery has failed
                Delivery.objects.create(
                    order=delivery.order
                )

