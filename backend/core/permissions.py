from rest_framework import permissions
from rest_framework.permissions import BasePermission
from hr.models  import Employee

class IsEmployee(permissions.BasePermission):
    def has_permission(self, request, view):
        # Check if user is authenticated, is_staff=True, and has an Employee record
        
        return (
            request.user.is_authenticated and
            request.user.is_staff 
        )



# class IsManager(permissions.BasePermission):
#     def has_permission(self, request, view):
#         return request.user.groups.filter(role='Manager').exists()

# class IsStaff(permissions.BasePermission):
#     def has_permission(self, request, view):
#         return request.user.groups.filter(role='Staff').exists()

class IsSalesManager(BasePermission):
    message = "Access Restricted to Sales Manager."

    def has_permission(self, request, view):
        return Employee.objects.filter(
            user=request.user,
            role__name="staff",
            department__name="sales"
            ).exists()
    
class IsSalesStaff(BasePermission):
    message = "Access Restricted to Sales Staff."
    
    def has_permission(self,request, view):
        return Employee.objects.filter(
            
            user=request.user,
            role__name="staff",
            department__name="sales"
            ).exists()
        


class IsWarehouseStaff(BasePermission):
    message = "Access restricted to warehouse staff."

    def has_permission(self, request, view):
        return Employee.objects.filter(
            user=request.user,
            role__name="staff",
            department__name="warehouse"  
        ).exists()

class IsWarehouseManager(BasePermission):
    message = "Access restricted to warehouse managers."

    def has_permission(self, request, view):
        return Employee.objects.filter(
            user=request.user,
            role__name="manager",
            department__name="warehouse"  
        ).exists()


class IsWarehouseTeam(BasePermission):
    message = "Access restricted to warehouse staff or managers."

    def has_permission(self, request, view):
        if not request.user.is_authenticated:
            return False

        return Employee.objects.filter(
            user=request.user,
            role__name__in=["staff", "manager"],  # Check role names
            department__name="warehouse"          # Check department name
        ).exists()
    

class IsFinanceTeam(BasePermission):
    message = "Access restricted to finance staff."
    def has_permission(self, request, view):
        return Employee.objects.filter(
            user=request.user,
            department__name="finance"  
        ).exists()