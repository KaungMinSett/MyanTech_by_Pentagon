# signals.py
from django.db.models.signals import post_save
from django.dispatch import receiver
from django.db import transaction
from .models import Outbound, InventoryList

@receiver(post_save, sender=Outbound)
def update_inventory_on_outbound(sender, instance, created, **kwargs):
    if created:  # Only act on new outbound records
        with transaction.atomic():
            # Get the inventory entry for the product and warehouse
            inventory_entry = InventoryList.objects.get(
                product=instance.product,
                warehouse=instance.warehouse
            )
            
            # Check if sufficient stock exists
            if inventory_entry.quantity >= instance.quantity:
                inventory_entry.quantity -= instance.quantity
                inventory_entry.save()
            else:
                raise ValueError(f"Insufficient stock for {instance.product.name} in {instance.warehouse.name}!")