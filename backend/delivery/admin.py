from django.contrib import admin
from .models import *


@admin.register(Delivery)
class DeliveryAdmin(admin.ModelAdmin):
    pass



@admin.register(DeliveryGroup)
class DeliveryGroupAdmin(admin.ModelAdmin):
    list_display = ('id', 'status',)


@admin.register(ReturnDelivery)
class ReturnDeliveryAdmin(admin.ModelAdmin):
    list_display = (
        'return_request', 
        'delivery_group',
        'status',
        'created_at',
        'updated_at'
    )
    list_filter = (
        'status', 
        ('delivery_group', admin.RelatedOnlyFieldListFilter),
    )
    search_fields = (
        'return_request__id',
        'return_request__customer__user__username',
        'delivery_group__name'
    )
    raw_id_fields = ('return_request', 'delivery_group')
    readonly_fields = ('created_at', 'updated_at')
    date_hierarchy = 'created_at'
    
    fieldsets = (
        ('Main Information', {
            'fields': (
                'return_request',
                'delivery_group',
                'status',
                'notes'
            )
        }),
        ('Timestamps', {
            'fields': (
                ('created_at', 'updated_at'),
            ),
            'classes': ('collapse',),
        }),
    )

    def get_readonly_fields(self, request, obj=None):
        """Make return_request read-only after creation"""
        if obj:  # Existing object
            return self.readonly_fields + ('return_request',)
        return self.readonly_fields

    def has_add_permission(self, request):
        """Prevent manual creation since it should be automated"""
        return False

    # def has_delete_permission(self, request, obj=None):
    #     """Prevent deletion through admin interface"""
    #     return False