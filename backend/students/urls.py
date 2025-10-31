from rest_framework import routers
from .views import StudentViewSet
from django.urls import path, include

router = routers.DefaultRouter()
router.register(r'students', StudentViewSet)

urlpatterns = [path('', include(router.urls))]
