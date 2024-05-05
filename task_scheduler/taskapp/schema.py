from drf_spectacular.utils import extend_schema, OpenApiParameter, OpenApiTypes
from .serializers import TaskSerializer

tasks_docs = extend_schema(
    responses=TaskSerializer,
    parameters=[
        OpenApiParameter(
            name='by_status',
            type=OpenApiTypes.STR,
            location=OpenApiParameter.QUERY
        ),
        OpenApiParameter(
            name='by_performer',
            type=OpenApiTypes.STR,
            location=OpenApiParameter.QUERY
        ),
        OpenApiParameter(
            name='by_id',
            type=OpenApiTypes.STR,
            location=OpenApiParameter.QUERY
        ),
    ])
