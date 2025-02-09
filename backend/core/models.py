from django.contrib.auth.models import AbstractUser
from django.db import models

# Extending User Model which is provided by Django
class User(AbstractUser):
    email = models.EmailField(unique=True)