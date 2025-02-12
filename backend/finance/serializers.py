from rest_framework import serializers
from .models import CashSubmission

class CashSubmissionSerializer(serializers.ModelSerializer):
    class Meta:
        model = CashSubmission
        fields = '__all__'
        read_only_fields = ('submission_date', 'verification_date')