from django.db import models

# Create your models here.

class Brand(models.Model):
    id = models.AutoField(primary_key=True)
    name = models.CharField(max_length=100, unique=True)

    def __str__(self):
        return self.name

class Category(models.Model):
     id = models.AutoField(primary_key=True)
     name = models.CharField(max_length=100, unique=True)
     
     def __str__(self):
        return self.name

class Warehouse(models.Model):
    id = models.AutoField(primary_key=True)
    name = models.CharField(max_length=100, unique=True)
    address = models.CharField(max_length=200)

    def __str__(self):
        return f"{self.name} - {self.location}"


class InventoryList(models.Model):
    product = models.ForeignKey('Product', on_delete=models.CASCADE)
    warehouse = models.ForeignKey('Warehouse', on_delete=models.CASCADE)
    quantity = models.PositiveIntegerField(default=0)

    class Meta:
        # Ensure a product can only have one entry per warehouse
        unique_together = ('product', 'warehouse')

    def __str__(self):
        return f"{self.product.name} in {self.warehouse.name}: {self.quantity} units"



class Product(models.Model):
    id = models.AutoField(primary_key=True)
    name = models.CharField(max_length=200)
    category = models.ForeignKey('Category', on_delete=models.CASCADE)
    brand = models.ForeignKey('Brand', on_delete=models.CASCADE)
    description = models.TextField(blank=True, null=True)  # optional 

    def total_quantity(self):
        """Total quantity of this product across all warehouses."""
        return InventoryList.objects.filter(product=self).aggregate(total=models.Sum('quantity'))['total'] or 0

    def quantity_in_warehouse(self, warehouse):
        """Quantity of this product in a specific warehouse."""
        try:
            return InventoryList.objects.get(product=self, warehouse=warehouse).quantity
        except InventoryList.DoesNotExist:
            return 0
   

    def __str__(self):
        return self.name
    

    





    



