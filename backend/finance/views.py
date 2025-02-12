

# Create your views here.


from django.utils import timezone


    
from rest_framework import generics, permissions
from .models import CashSubmission
from .serializers import CashSubmissionSerializer
from core.permissions import IsFinanceTeam

class CashSubmissionList(generics.ListAPIView):
    queryset = CashSubmission.objects.all()
    serializer_class = CashSubmissionSerializer
    permission_classes = [IsFinanceTeam]

class CashSubmissionVerify(generics.UpdateAPIView):
    queryset = CashSubmission.objects.all()
    serializer_class = CashSubmissionSerializer
    permission_classes = [IsFinanceTeam]  # Restrict to finance team

    def perform_update(self, serializer):
        serializer.save(
            status='VERIFIED',
            verified_by=self.request.user,
            verification_date=timezone.now()
        )