from django.contrib.auth.models import AbstractUser
from django.db import models

class User(AbstractUser):
    pass

class Task(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    name = models.CharField(max_length=50)
    status = models.CharField(max_length=15)
    type = models.CharField(max_length=10)