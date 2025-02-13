from django.contrib import admin
from .models import Price,OrderItem,OrderLogs,Order
from django.utils.timezone import now,timedelta
from django.forms.models import BaseInlineFormSet
from django.core.exceptions import ValidationError
admin.site.register(Price)




admin.site.register(OrderLogs)



class OrderItemFormSet(BaseInlineFormSet):
    def clean(self):
        super().clean()
        if not any(cleaned_data.get('product') for cleaned_data in self.cleaned_data):
            raise ValidationError("At least one order item is required")

class OrderItemInline(admin.TabularInline):
    model = OrderItem
  
    formset = OrderItemFormSet
    extra = 1
    min_num = 1  # Require at least one order item
    fields = ['product', 'quantity', 'unit_price']

@admin.register(Order)
class OrderAdmin(admin.ModelAdmin):
    inlines = [OrderItemInline]

    exclude = ['total_price']
    
    def save_formset(self, request, form, formset, change):
        instances = formset.save(commit=False)
        for instance in instances:
            # Auto-populate unit_price from product price if not set
            if not instance.unit_price:
                instance.unit_price = instance.product.price
        super().save_formset(request, form, formset, change)