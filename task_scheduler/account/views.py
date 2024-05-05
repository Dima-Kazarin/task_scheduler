from drf_spectacular.utils import extend_schema
from rest_framework import viewsets, views, status
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response

from .models import Account
from .serializers import AccountSerializer, RegisterSerializer
from .schema import user_list_docs


class AccountViewSet(viewsets.ViewSet):
    permission_classes = [IsAuthenticated, ]

    @user_list_docs
    def list(self, request):
        queryset = Account.objects.all()

        user_id = request.query_params.get('user_id')

        if user_id:
            queryset = queryset.filter(id=user_id)

        serializer = AccountSerializer(queryset, many=True)
        return Response(serializer.data)


class RegisterView(views.APIView):
    @extend_schema(request=RegisterSerializer)
    def post(self, request):
        serializer = RegisterSerializer(data=request.data)

        if serializer.is_valid():
            serializer.save()
            return Response(status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
