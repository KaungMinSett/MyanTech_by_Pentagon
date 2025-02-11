from django.db.models.signals import post_save
from django.dispatch import receiver
from .models import Order
from delivery.models import Delivery

@receiver(post_save, sender=Order)
def create_delivery_after_approval(sender, instance, created, **kwargs):
    if instance.status == "Approved":
        Delivery.objects.create(
            order=instance
        )
    