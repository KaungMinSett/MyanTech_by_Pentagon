from geopy.distance import geodesic
from .models import Delivery, DeliveryGroup
from hr.models import Employee
from warehouse.models import Warehouse

def assign_deliveries_to_drivers():
    DELIVERY_THRESHOLD_LEVEL = 2
    print("triggered")
    
    # Get pending deliveries
    pending_deliveries = Delivery.objects.filter(status='P', delivery_group__isnull=True, order__warehouse_ready=True)
    print(len(pending_deliveries))
    # print(len(pending_deliveries) + " Deliveries Found to assign")
    # Don't assign if not enough delivieries yet
    if (len(pending_deliveries) < DELIVERY_THRESHOLD_LEVEL):
        print("Shouldn't assign now")
        return
    print("Should assign now")
    # Get warehouse coordinates (Assuming warehouse ID 1 is the default)
    warehouse = Warehouse.objects.filter(id=1).first()
    if not warehouse:
        return
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
        return

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