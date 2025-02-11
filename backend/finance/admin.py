from django.contrib import admin
from .models import CashSubmission

# Register your models here.

@admin.register(CashSubmission)
class CashSubmissionAdmin(admin.ModelAdmin):
    list_display = ('id', 'delivery_group', 'total_cash', 'status', 'verification_date')  # Use 'id' instead
    list_filter = ('status',)
    actions = ['mark_verified']

    def mark_verified(self, request, queryset):
        queryset.update(status='VERIFIED')
    mark_verified.short_description = "Mark selected submissions as VERIFIED"


