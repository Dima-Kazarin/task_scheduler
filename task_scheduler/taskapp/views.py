from django.shortcuts import get_object_or_404
from drf_spectacular.utils import extend_schema
from rest_framework.decorators import action
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework import viewsets, status

from .models import Task, TaskStatus
from .serializers import TaskSerializer, TaskStatusSerializer
from .schema import tasks_docs


class TaskViewSet(viewsets.ViewSet):
    permission_classes = [IsAuthenticated,]

    @tasks_docs
    def list(self, request):
        queryset = Task.objects.all()

        by_id = request.query_params.get('by_id')
        by_status = request.query_params.get('by_status')
        by_performer = request.query_params.get('by_performer')

        if by_id:
            queryset = queryset.filter(id=by_id)

        if by_status:
            queryset = queryset.filter(status__name=by_status)

        if by_performer:
            queryset = queryset.filter(performer__username=by_performer)

        queryset = queryset.order_by('id')

        serializer = TaskSerializer(queryset, many=True)
        return Response(serializer.data)

    @extend_schema(request=TaskSerializer)
    def create(self, request):
        serializer = TaskSerializer(data=request.data)

        if serializer.is_valid():
            serializer.save()
            return Response(status=status.HTTP_201_CREATED)
        return Response(status=status.HTTP_400_BAD_REQUEST)

    @extend_schema(request=TaskSerializer)
    def update(self, request, pk=None):
        obj = get_object_or_404(Task, pk=pk)
        serializer = TaskSerializer(obj, data=request.data)

        if serializer.is_valid():
            serializer.save()
            return Response(status=status.HTTP_200_OK)
        return Response(status=status.HTTP_400_BAD_REQUEST)

    @extend_schema(request=TaskSerializer)
    def destroy(self, request, pk=None):
        obj = get_object_or_404(Task, pk=pk)
        obj.delete()
        return Response(status=status.HTTP_200_OK)

    @action(methods=['PUT'], detail=False, url_path=r'change_status/(?P<pk>[\d]+)')
    def change_task_status(self, request, pk=None):
        obj = get_object_or_404(Task, pk=pk)
        serializer = TaskSerializer(obj, data=request.data, partial=True)
        status_in_progress = get_object_or_404(TaskStatus, pk=2)
        if serializer.is_valid():
            if obj.status == status_in_progress:
                new_status = get_object_or_404(TaskStatus, pk=3)
            else:
                new_status = get_object_or_404(TaskStatus, pk=2)

            obj.status = new_status
            obj.save()
            return Response(serializer.data)
        return Response(serializer.errors)


class TaskStatusViewSet(viewsets.ViewSet):
    @extend_schema(responses=TaskStatusSerializer)
    def list(self, request):
        queryset = TaskStatus.objects.all()
        serializer = TaskStatusSerializer(queryset, many=True)

        return Response(serializer.data)
