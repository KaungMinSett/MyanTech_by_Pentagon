from .models import Customer
from rest_framework import serializers
from djoser.serializers import UserSerializer as BaseUserSerializer
from django.contrib.auth import get_user_model

User = get_user_model()

class CustomerSerializer(serializers.ModelSerializer):
    
    user = BaseUserSerializer()

    class Meta:
        model = Customer
        fields = ("id", "user")
        
# class CustomerCreateSerializer(serializers.ModelSerializer):
#     """Serializer for creating a new Employee with user record"""
#     username = serializers.CharField(write_only=True)
#     password = serializers.CharField(write_only=True)
#     email = serializers.EmailField(write_only=True)

#     class Meta:
#         model = Customer
#         fields = ("email", "username", "password")

#     def create(self, validated_data):
#         # Extract user-related data
#         user_data = {
#             'username': validated_data.pop('username'),
#             'password': validated_data.pop('password'),
#             'email': validated_data.pop('email'),
#         }

#         # Create the User record
#         user = User.objects.create_user(**user_data)

#         # Create the Employee record linked to the User
#         employee = Customer.objects.create(user=user, **validated_data)

#         return employee
        
        