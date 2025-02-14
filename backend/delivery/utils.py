from geopy.distance import geodesic
from .models import Delivery, DeliveryGroup, ReturnDelivery
from hr.models import Employee
from warehouse.models import Warehouse
from itertools import chain

def assign_deliveries_to_drivers():
    DELIVERY_THRESHOLD_LEVEL = 2
    print("triggered")
    
     # Get regular deliveries
    pending_deliveries = Delivery.objects.filter(
        status='P',
        delivery_group__isnull=True,
        order__warehouse_ready=True
    )

    # Get return deliveries
    pending_returns = ReturnDelivery.objects.filter(
        status='PENDING',
        delivery_group__isnull=True,
        return_request__status='APPROVED'
    )
    
    # Get pending deliveries
    combined_deliveries = list(chain(pending_deliveries, pending_returns))
    print(len(combined_deliveries))
    # print(len(combined_deliveries) + " Deliveries Found to assign")
    # Don't assign if not enough delivieries yet
    if (len(combined_deliveries) < DELIVERY_THRESHOLD_LEVEL):
        print("Shouldn't assign now")
        return
    print("Should assign now")
    # Get warehouse coordinates (Assuming warehouse ID 1 is the default)
    warehouse = Warehouse.objects.filter(id=1).first()
    if not warehouse:
        return
    warehouse_coords = (warehouse.latitude, warehouse.longitude)
    
    # Sort deliveries by distance from warehouse
    # combined_deliveries = sorted(
    #     combined_deliveries,
    #     key=lambda delivery: geodesic(
    #         warehouse_coords,
    #         (delivery.order.address.latitude, delivery.order.address.longitude)
    #     ).km
    # )

     # Sort deliveries by distance from warehouse
    combined_deliveries = sorted(
    combined_deliveries,
    key=lambda item: geodesic(
        warehouse_coords,
        (
            (item.order.address.latitude, item.order.address.longitude)
            if isinstance(item, Delivery)
            else (item.return_request.order.address.latitude,
                  item.return_request.order.address.longitude)
        )
    ).km
)

    

    # Get available drivers
    drivers = Employee.objects.filter(department__name='warehouse', role__name='driver')
    if not drivers.exists():
        return

    # Divide deliveries into chunks for each driver
    chunk_size = len(combined_deliveries) // len(drivers)
    for i, driver in enumerate(drivers):
        start_index = i * chunk_size
        end_index = (i + 1) * chunk_size if i < len(drivers) - 1 else len(combined_deliveries)

        # Create a delivery group for the driver
        delivery_group = DeliveryGroup.objects.create(
            warehouse=warehouse,
            employee=driver,
            status='P'
        )

        # Assign deliveries to the group
        for delivery in combined_deliveries[start_index:end_index]:
            delivery.delivery_group = delivery_group
            delivery.status = 'A'  # Mark as Assigned
            delivery.save()
        
        