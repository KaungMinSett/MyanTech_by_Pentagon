from djoser.serializers import UserSerializer as BaseUserSerializer, UserCreateSerializer as BaseUserCreateSerializer
from django.db import transaction
from django.conf import settings
from django.contrib.auth import get_user_model
from rest_framework import serializers
from hr.models import Employee, Department, Role
from shop.models import Customer

User = get_user_model()

class UserCreateSerializer(BaseUserCreateSerializer):
    
    class Meta(BaseUserCreateSerializer.Meta):
        fields = ['id', 'email', 'username', 'password']
        
    def create(self, validated_data):
        user = super().create(validated_data)
        Customer.objects.create(user=user)
        return user

