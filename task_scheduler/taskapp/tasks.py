from datetime import datetime
from celery import shared_task

from .models import Task
from .serializers import TaskSerializer


@shared_task(queue='tasks')
def task1():
    date_format = "%Y-%m-%dT%H:%M:%SZ"

    obj = Task.objects.all()
    a = []
    serializer = TaskSerializer(obj, many=True)

    for i in serializer.data:
        time_end = i['time_end'].split('.')[0]
        if datetime.strptime(time_end, date_format) < datetime.now() and i['status'] != 3:
            a.append(i['name'])

    for i in a:
        return f'task {i} is already overdue'
