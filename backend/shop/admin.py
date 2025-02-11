from django.contrib import admin
from .models import Customer,Address


class AddressInline(admin.TabularInline):  # Use StackedInline for vertical layout
    model = Address
    extra = 1  # Allows adding a new address inline

class CustomerAdmin(admin.ModelAdmin):
    list_display = ('full_name', 'phone')
    search_fields = ('full_name', 'phone')
    list_filter = ('is_registered',)
    inlines = [AddressInline]  # Enables inline address addition in Customer Admin

admin.site.register(Customer, CustomerAdmin)
admin.site.register(Address)