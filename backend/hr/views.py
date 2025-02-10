from rest_framework.response import Response
from rest_framework_simplejwt.views import TokenObtainPairView
from django.contrib.auth import get_user_model
from rest_framework import viewsets
from .models import Employee
from .serializers import *

User = get_user_model()

class EmployeeViewSet(viewsets.ModelViewSet):
    queryset = Employee.objects.all()
    def get_serializer_class(self):
        if self.request.method == "POST":
            return EmployeeCreateSerializer  # Use custom serializer for creation
        return EmployeeSerializer  # Use standard serializer for retrieval

class EmployeeLoginView(TokenObtainPairView):
    def post(self, request, *args, **kwargs):
        response = super().post(request, *args, **kwargs)
        user = User.objects.get(username=request.data['username'])
        if user.is_staff and Employee.objects.filter(user=user).exists():
            return response
        else:
            return Response({'error': 'User is not authorized for employee access'}, status=403)