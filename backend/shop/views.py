from rest_framework_simplejwt.views import TokenObtainPairView
from .models import Customer
from django.contrib.auth import get_user_model
from rest_framework.response import Response
from rest_framework import viewsets
from .serializers import CustomerSerializer

User = get_user_model()

class CustomerViewSet(viewsets.ModelViewSet):
    queryset = Customer.objects.all()
    permission_classes = []
    
    def get_serializer_class(self):
        return CustomerSerializer

class CustomerLoginView(TokenObtainPairView):
    
    permission_classes = []
    
    def post(self, request, *args, **kwargs):
        response = super().post(request, *args, **kwargs)
        user = User.objects.get(username=request.data['username'])
        if not user.is_staff and Customer.objects.filter(user=user).exists():
            return response
        else:
            return Response({'error': 'Employee credentials are not allowed'}, status=403)