from django.contrib import admin
from .models import CashSubmission

# Register your models here.

@admin.register(CashSubmission)
class CashSubmissionAdmin(admin.ModelAdmin):
    list_display = ('id', 'delivery_group', 'total_cash', 'status', 'verification_date')  # Use 'id' instead
    list_filter = ('status',)
    actions = ['mark_verified']

    def mark_verified(self, request, queryset):
         
        for submission in queryset:
            submission.status = 'VERIFIED'
            submission.save()  # Triggers post_save signal
        self.message_user(request, f"{queryset.count()} submissions marked as verified.")
    mark_verified.short_description = "Mark selected submissions as VERIFIED"
        
    mark_verified.short_description = "Mark selected submissions as VERIFIED"


