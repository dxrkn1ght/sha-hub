from rest_framework import routers
from .views import TeacherViewSet
from django.urls import path, include

router = routers.DefaultRouter()
router.register(r'teachers', TeacherViewSet)

urlpatterns = [path('', include(router.urls))]
