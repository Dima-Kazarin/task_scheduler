import os
from datetime import timedelta

from celery import Celery
from kombu import Queue, Exchange

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'task_scheduler.settings')

app = Celery('task_scheduler')
app.config_from_object('django.conf:settings', namespace='CELERY')

app.conf.task_queues = [
    Queue('tasks', Exchange('tasks'), routing_key='tasks', queue_arguments={'x-max-priority': 10}),
]


app.conf.task_acks_late = True
app.conf.task_default_priority = 5
app.conf.worker_prefetch_multiplier = 1
app.conf.worker_concurrency = 1

app.conf.beat_schedule = {
    'task1': {
        'task': 'taskapp.tasks.task1',
        'schedule': timedelta(hours=1),
    }
}

app.autodiscover_tasks()
