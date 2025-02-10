
from rest_framework import permissions

class IsEmployee(permissions.BasePermission):
    def has_permission(self, request, view):
        # Check if user is authenticated, is_staff=True, and has an Employee record
        
        return (
            request.user.is_authenticated and
            request.user.is_staff 
        )
    


class IsManager(permissions.BasePermission):
    def has_permission(self, request, view):
        return request.user.groups.filter(name='Manager').exists()

class IsStaff(permissions.BasePermission):
    def has_permission(self, request, view):
        return request.user.groups.filter(name='Staff').exists()