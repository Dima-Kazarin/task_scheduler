from django.db import models
from django.conf import settings


class TaskStatus(models.Model):
    name = models.CharField(max_length=50)

    def __str__(self):
        return self.name


class Task(models.Model):
    name = models.CharField(max_length=100)
    description = models.TextField()
    time_create = models.DateTimeField(auto_now_add=True)
    time_end = models.DateTimeField(null=True, blank=True)
    performer = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    status = models.ForeignKey(TaskStatus, on_delete=models.CASCADE)

    def __str__(self):
        return self.name
