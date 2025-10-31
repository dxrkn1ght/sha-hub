from rest_framework import routers
from .views import GroupViewSet
from django.urls import path, include

router = routers.DefaultRouter()
router.register(r'groups', GroupViewSet)

urlpatterns = [path('', include(router.urls))]
