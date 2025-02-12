from django.contrib import admin
from .models import Price,OrderItem,OrderLogs,Order
from django.utils.timezone import now,timedelta

admin.site.register(Price)

class OrderAdmin(admin.ModelAdmin):
    list_display = ('id', 'customer_id', 'order_date', 'status', 'reconciliation_status', 'get_total_price')
    list_filter = ('customer_id', 'status')

    def get_queryset(self, request):
        queryset = super().get_queryset(request)
        last_week = now() - timedelta(days=7)
        return queryset.filter(order_date__gte=last_week)


admin.site.register(Order, OrderAdmin)
admin.site.register(OrderLogs)
admin.site.register(OrderItem)

