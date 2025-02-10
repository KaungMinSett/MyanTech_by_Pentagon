from djoser.serializers import UserCreateSerializer as BaseUserCreateSerializer, TokenCreateSerializer as BaseTokenCreateSerializer
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
    
class TokenCreateSerializer(BaseTokenCreateSerializer):
    
    def validate(self, attrs):
        print("<<<<<<<< triggered >>>>>>>>>> ")
        attrs = super().validate(attrs)
        user = self.user
        if user.is_staff:
            raise serializers.ValidationError('Credentials of Staffs are not allowed here')
        return attrs
    
    def create(self, validated_data):
        print("<Create triggered>>>")
        return super().create(validated_data)
    

