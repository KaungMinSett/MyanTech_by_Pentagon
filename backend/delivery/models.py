from django.db import models
from warehouse.models import Warehouse
from hr.models import Employee
from sales.models import Order
from math import sqrt

class DeliveryGroup(models.Model):
    """
    Represents a group of deliveries assigned to a driver
    """
    # Status constants
    IN_PROGRESS = "I"
    COMPLETE = "C"
    FAILED = "F"
    STATUS_CHOICES = [
        (IN_PROGRESS, "In progress"),
        (COMPLETE, "Complete"),
        (FAILED, "Failed"),
    ]
    
    # Relationships
    warehouse = models.ForeignKey(Warehouse, on_delete=models.CASCADE)
    employee = models.ForeignKey(Employee, on_delete=models.CASCADE)
    
    # Tracking fields
    status = models.CharField(max_length=1, choices=STATUS_CHOICES, default=IN_PROGRESS)
    latitude = models.DecimalField(max_digits=9, decimal_places=6)   # Current location
    longitude = models.DecimalField(max_digits=9, decimal_places=6)  # Current location
    
    # Timestamps
    created_at = models.DateTimeField(auto_now_add=True)
    last_updated_at = models.DateTimeField(auto_now=True)
    
    def get_current_location(self):
        """Returns driver's current position as (lat, lon) tuple"""
        return (float(self.latitude), float(self.longitude))
    
    def update_location(self):
        """
        Updates group location to last completed delivery's destination
        Call this after completing each delivery
        """
        last_completed = self.delivery_set.filter(
            status=Delivery.COMPLETE
        ).order_by('-sequence_number').first()
        
        if last_completed:
            self.latitude = last_completed.destination_lat
            self.longitude = last_completed.destination_lon
            self.save()

class Delivery(models.Model):
    """
    Represents an individual delivery order
    """
    # Status constants
    PENDING = "P"
    IN_PROGRESS = "I"
    COMPLETE = "C"
    STATUS_CHOICES = [
        (PENDING, "Pending"),
        (IN_PROGRESS, "In progress"),
        (COMPLETE, "Complete"),
    ]
    
    # Relationships
    delivery_group = models.ForeignKey(DeliveryGroup, on_delete=models.CASCADE)
    order = models.ForeignKey(Order, on_delete=models.CASCADE)
    
    # Delivery details
    status = models.CharField(max_length=1, choices=STATUS_CHOICES, default=PENDING)
    sequence_number = models.PositiveIntegerField(default=0)  # Order in delivery route
    remark = models.TextField(max_length=255)  # Delivery notes
    
    # Distance calculation
    distance_from_warehouse = models.FloatField(null=True)
    
    # Timestamps
    created_at = models.DateTimeField(auto_now_add=True)
    last_updated_at = models.DateTimeField(auto_now=True)
    
    def calculate_distance(self, warehouse_point):
        """
        Calculate straight-line distance from warehouse
        warehouse_point: Tuple of (latitude, longitude)
        """
        lat_diff = float(self.order.address.lat) - warehouse_point[0]
        lon_diff = float(self.order.address.lon) - warehouse_point[1]
        self.distance_from_warehouse = sqrt(lat_diff**2 + lon_diff**2)
        self.save()
        
    def get_next_delivery(self):
        """
        Get next delivery in sequence for this group
        Returns None if no more deliveries
        """
        return Delivery.objects.filter(
            delivery_group=self.delivery_group,
            sequence_number__gt=self.sequence_number
        ).order_by('sequence_number').first()

class DeliveryGroupManager(models.Manager):
    """
    Custom manager for bulk delivery group operations
    """
    def create_delivery_groups(self, warehouse_id):
        """
        Automatically creates delivery groups and assigns deliveries
        Steps:
        1. Get pending deliveries sorted by distance
        2. Get available drivers
        3. Split deliveries into equal groups
        4. Create delivery groups and assign deliveries
        """
        # Get sorted pending deliveries
        deliveries = Delivery.objects.filter(
            status=Delivery.PENDING,
            delivery_group__isnull=True
        ).order_by('distance_from_warehouse')
        
        # Get available warehouse drivers
        drivers = Employee.objects.filter(
            department__name='warehouse',
            is_available=True
        )
        
        if not drivers.exists():
            raise ValueError("No available drivers")
            
        # Split deliveries into driver groups
        delivery_chunks = self.split_into_chunks(deliveries, len(drivers))
        
        # Create groups and assign deliveries
        warehouse = Warehouse.objects.get(pk=warehouse_id)
        for driver, chunk in zip(drivers, delivery_chunks):
            # Create new delivery group
            group = DeliveryGroup.objects.create(
                warehouse=warehouse,
                employee=driver,
                latitude=warehouse.latitude,
                longitude=warehouse.longitude
            )
            
            # Assign deliveries to this group
            chunk.update(
                delivery_group=group,
                status=Delivery.IN_PROGRESS,
                sequence_number=models.F('sequence_number')
            )

    def split_into_chunks(self, queryset, num_chunks):
        """
        Split deliveries into roughly equal chunks
        Example: 10 deliveries ÷ 3 drivers → [4, 3, 3]
        """
        total = queryset.count()
        chunk_size = total // num_chunks
        chunks = []
        
        for i in range(num_chunks):
            start = i * chunk_size
            end = (i + 1) * chunk_size if i != num_chunks - 1 else total
            chunks.append(queryset[start:end])
            
        return chunks

# Attach the custom manager to DeliveryGroup
DeliveryGroup.objects = DeliveryGroupManager()