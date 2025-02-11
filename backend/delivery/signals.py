from django.db.models.signals import post_save
from django.dispatch import receiver
from geopy.distance import geodesic
from .models import Delivery, DeliveryGroup
from hr.models import Employee
from warehouse.models import Warehouse

@receiver(post_save, sender=Delivery)
def assign_deliveries_to_drivers(sender, instance, created, **kwargs):
    if created and instance.status == 'P':
        # Get all pending deliveries
        pending_deliveries = Delivery.objects.filter(status='P', delivery_group__isnull=True)

        # Get warehouse coordinates (fixed to one warehouse for now)
        warehouse = Warehouse.objects.get(id=1)  # Assuming warehouse ID 1 is the default
        warehouse_coords = (warehouse.latitude, warehouse.longitude)

        # Sort deliveries by distance from warehouse
        pending_deliveries = sorted(
            pending_deliveries,
            key=lambda delivery: geodesic(
                warehouse_coords,
                (delivery.order.address.latitude, delivery.order.address.longitude)
            ).km
        )

        # Get available drivers
        drivers = Employee.objects.filter(department__name='warehouse', role__name='driver')

        if not drivers.exists():
            raise ValueError("No available drivers")

        # Divide deliveries into chunks for each driver
        chunk_size = len(pending_deliveries) // len(drivers)
        for i, driver in enumerate(drivers):
            start_index = i * chunk_size
            end_index = (i + 1) * chunk_size if i < len(drivers) - 1 else len(pending_deliveries)

            # Create a delivery group for the driver
            delivery_group = DeliveryGroup.objects.create(
                warehouse=warehouse,
                employee=driver,
                status='P'
            )

            # Assign deliveries to the group
            for delivery in pending_deliveries[start_index:end_index]:
                delivery.delivery_group = delivery_group
                delivery.status = 'A'  # Mark as Assigned
                delivery.save()
                
@receiver(post_save, sender=Delivery)
def update_order_status(sender, instance, **kwargs):
    if instance.status == 'C':  # Completed
        order = instance.order
        order.status = 'Delivered'  # Assuming Order has a 'status' field
        order.save()