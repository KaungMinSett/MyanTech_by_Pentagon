from django.contrib import admin
from .models import Customer,Address, ReturnRequestItem, ReturnRequest
from django.forms.models import BaseInlineFormSet
from django.core.exceptions import ValidationError


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


class RequiredInlineFormSet(BaseInlineFormSet):
    def clean(self):
        super().clean()
        if any(self.errors):
            return
        if not any(cleaned_data and not cleaned_data.get('DELETE', False)
                   for cleaned_data in self.cleaned_data):
            raise ValidationError("At least one item is required")

class ReturnRequestItemInline(admin.TabularInline):
    model = ReturnRequestItem
    formset = RequiredInlineFormSet
    extra = 1
    min_num = 1

@admin.register(ReturnRequest)
class ReturnRequestAdmin(admin.ModelAdmin):
    inlines = [ReturnRequestItemInline]