from django.contrib import admin

# Register your models here.

# warehouse/admin.py
from django.contrib import admin
from .models import Brand, Category, Product, Warehouse, InventoryList, Outbound

@admin.register(Brand)
class BrandAdmin(admin.ModelAdmin):
    list_display = ('id', 'name')
    search_fields = ('name',)

@admin.register(Category)
class CategoryAdmin(admin.ModelAdmin):
    list_display = ('id', 'name')
    search_fields = ('name',)

@admin.register(Product)
class ProductAdmin(admin.ModelAdmin):
    list_display = ('id', 'name', 'category', 'brand', 'description_short')
    list_filter = ('category', 'brand')
    search_fields = ('name', 'description')
    raw_id_fields = ('category', 'brand')  # For better UX with many categories/brands

    def description_short(self, obj):
        return obj.description[:50] + '...' if obj.description else ''
    description_short.short_description = 'Description'

@admin.register(Warehouse)
class WarehouseAdmin(admin.ModelAdmin):
    list_display = ('id', 'name',)
    search_fields = ('name', 'address')

@admin.register(InventoryList)
class InventoryListAdmin(admin.ModelAdmin):
    list_display = ('id', 'product', 'warehouse', 'quantity')
    list_filter = ('warehouse',)
    search_fields = ('product__name', 'warehouse__name')
    raw_id_fields = ('product', 'warehouse')

@admin.register(Outbound)
class OutboundAdmin(admin.ModelAdmin):
    list_display = ('id', 'product', 'warehouse', 'quantity', 'reason', 'timestamp', 'staff')
    list_filter = ('reason', 'warehouse', 'timestamp')
    search_fields = ('product__name', 'staff__username')
    raw_id_fields = ('product', 'warehouse', 'staff')
    date_hierarchy = 'timestamp'

    def get_queryset(self, request):
        return super().get_queryset(request).select_related(
            'product', 'warehouse', 'staff'
        )

