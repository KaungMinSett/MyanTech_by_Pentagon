

from django.urls import path
from .views import CashSubmissionList, CashSubmissionVerify

urlpatterns = [
    path('cash-submissions/', CashSubmissionList.as_view(), name='cash-submission-list'),
    path('cash-submissions/<int:pk>/verify/', CashSubmissionVerify.as_view(), name='cash-submission-verify'),
]