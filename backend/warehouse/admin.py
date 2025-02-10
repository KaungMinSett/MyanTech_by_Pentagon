from django.contrib import admin

# Register your models here.

# warehouse/admin.py
from django.contrib import admin
from .models import Brand, Category, Product, Warehouse, InventoryList, Outbound, Inbound
from django.utils.html import format_html

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

@admin.register(Inbound)
class InboundAdmin(admin.ModelAdmin):
    list_display = (
        'product', 
        'warehouse', 
        'quantity', 
        'status', 
        'created_by', 
        'resolved_by', 
        'created_at', 
        'updated_at'
    )
    list_filter = ('status', 'warehouse', 'created_at')
    search_fields = ('product__name', 'created_by__username')
    raw_id_fields = ('product', 'warehouse', 'created_by', 'resolved_by')
    date_hierarchy = 'created_at'
    actions = ['approve_selected', 'decline_selected']
    list_editable = ('status',)

    fieldsets = (
        (None, {
            'fields': ('product', 'warehouse', 'quantity')
        }),
        ('Status', {
            'fields': ('status', 'resolved_by')
        }),
        ('Audit', {
            'fields': ('created_by', 'created_at', 'updated_at'),
            'classes': ('collapse',)
        }),
    )

    readonly_fields = ( 'created_at', 'updated_at')

    def status_badge(self, obj):
        color = {
            'pending': 'orange',
            'approved': 'green',
            'declined': 'red'
        }.get(obj.status, 'gray')
        return format_html(
            '<span style="color: white; background-color: {}; padding: 2px 5px; border-radius: 3px">{}</span>',
            color,
            obj.get_status_display()
        )
    status_badge.short_description = 'Status'

    def get_queryset(self, request):
        qs = super().get_queryset(request)
        qs = qs.select_related('product', 'warehouse', 'created_by', 'resolved_by')
        return qs

    def save_model(self, request, obj, form, change):
        if change and 'status' in form.changed_data:
            obj.resolved_by = request.user
        super().save_model(request, obj, form, change)

    def approve_selected(self, request, queryset):
        updated = queryset.filter(status='pending').update(
            status='approved',
            resolved_by=request.user
        )
        self.message_user(request, f"{updated} inbound requests approved")
    approve_selected.short_description = "Approve selected requests"

    def decline_selected(self, request, queryset):
        updated = queryset.filter(status='pending').update(
            status='declined',
            resolved_by=request.user
        )
        self.message_user(request, f"{updated} inbound requests declined")
    decline_selected.short_description = "Decline selected requests"

    def get_readonly_fields(self, request, obj=None):
        if obj and obj.status != 'pending':
            return self.readonly_fields + ('status',)
        return self.readonly_fields

    def has_change_permission(self, request, obj=None):
        if obj and obj.status != 'pending':
            return False
        return super().has_change_permission(request, obj)
    
    def save_model(self, request, obj, form, change):
        if not change:  # Only for new objects
            obj.created_by = request.user
        super().save_model(request, obj, form, change)

    def get_readonly_fields(self, request, obj=None):
        # Make created_by read-only after creation
        if obj:
            return self.readonly_fields + ('created_by',)
        return self.readonly_fields
