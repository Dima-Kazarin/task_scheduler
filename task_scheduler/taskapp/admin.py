from django.contrib import admin

from .models import TaskStatus, Task

admin.site.register(TaskStatus)
admin.site.register(Task)
