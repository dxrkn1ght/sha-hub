from rest_framework import routers
from .views import CustomUserViewSet
from django.urls import path, include

router = routers.DefaultRouter()
router.register(r'users', CustomUserViewSet)

urlpatterns = [path('', include(router.urls))]
