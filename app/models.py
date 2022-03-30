from django.contrib.auth.models import AbstractUser
from django.db import models

class User(AbstractUser):
    pass

class Task(models.Model):
    task_user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='tasks')
    name = models.CharField(max_length=50)
    status = models.CharField(max_length=15)
    type = models.CharField(max_length=10)
    created = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['created']

    def serialize(self):
        return {
            'id': self.id,
            'name': self.name,
            'status': self.status,
            'type': self.type
        }