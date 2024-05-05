from django.contrib import admin
from django.urls import path
from drf_spectacular.views import SpectacularAPIView, SpectacularSwaggerView
from rest_framework.routers import DefaultRouter
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView

from taskapp.views import TaskViewSet, TaskStatusViewSet
from account.views import AccountViewSet, RegisterView

router = DefaultRouter()
router.register(r'task', TaskViewSet, basename='task')
router.register(r'task_status', TaskStatusViewSet, basename='task_status')
router.register(r'account', AccountViewSet, basename='account')

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/schema/', SpectacularAPIView.as_view(), name='schema'),
    path('api/schema/docs/', SpectacularSwaggerView.as_view(url_name='schema'), name='swagger-ui'),
    path('api/token/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('api/token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('api/register/', RegisterView.as_view(), name='register')
] + router.urls
