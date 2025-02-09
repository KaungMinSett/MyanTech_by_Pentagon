from core.serializers import UserCreateSerializer
from django.contrib.auth import get_user_model
from rest_framework import serializers
from .models import Employee, Department, Role
from djoser.serializers import UserSerializer as BaseUserSerializer


User = get_user_model()

class EmployeeSerializer(serializers.ModelSerializer):
    """Serializer for retrieving Employee details"""
    user = serializers.StringRelatedField()  # Returns username instead of ID
    department = serializers.StringRelatedField()
    role = serializers.StringRelatedField()

    class Meta:
        model = Employee
        fields = ("id", "user", "department", "role")


from rest_framework import serializers
from django.contrib.auth import get_user_model
from .models import Employee, Department, Role

User = get_user_model()

class EmployeeCreateSerializer(serializers.ModelSerializer):
    """Serializer for creating a new Employee with user record"""
    username = serializers.CharField(write_only=True)
    password = serializers.CharField(write_only=True)
    email = serializers.EmailField(write_only=True)
    department = serializers.PrimaryKeyRelatedField(queryset=Department.objects.all())
    role = serializers.PrimaryKeyRelatedField(queryset=Role.objects.all())

    class Meta:
        model = Employee
        fields = ("username", "email", "password", "department", "role")

    def create(self, validated_data):
        # Extract user-related data
        user_data = {
            'username': validated_data.pop('username'),
            'password': validated_data.pop('password'),
            'email': validated_data.pop('email'),
            'is_staff': True,  # Set is_staff to True
        }

        # Create the User record
        user = User.objects.create_user(**user_data)

        # Create the Employee record linked to the User
        employee = Employee.objects.create(user=user, **validated_data)

        return employee