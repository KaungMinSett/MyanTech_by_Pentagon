from django.contrib import admin
from .models import *


@admin.register(Delivery)
class DeliveryAdmin(admin.ModelAdmin):
    pass

@admin.register(DeliveryGroup)
class DeliveryGroupAdmin(admin.ModelAdmin):
    pass