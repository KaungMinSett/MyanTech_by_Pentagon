from django.db import models
from django.contrib.auth.models import User


# Create your models here.
class Customer(models.Model):
    user_id=models.OneToOneField(User,on_delete=models.CASCADE)
    full_name=models.CharField(max_length=100)
    phone=models.CharField(max_length=15)
    is_registered=models.BooleanField(default=False)
    created_at=models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.full_name


class Address(models.Model):
    customer = models.ForeignKey(Customer, on_delete=models.CASCADE, related_name="addresses")
    name = models.CharField(max_length=200)
    latitude = models.DecimalField(max_digits=9, decimal_places=6, blank=True, null=True)
    longitude = models.DecimalField(max_digits=9, decimal_places=6, blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.name}"



