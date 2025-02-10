from django.contrib import admin
from .models import Price,OrderItem,OrderLogs,Order
# Register your models here.
admin.site.register(Price)
admin.site.register(Order)
admin.site.register(OrderLogs)
admin.site.register(OrderItem)