from rest_framework import routers
from .views import PaymentViewSet
from django.urls import path, include

router = routers.DefaultRouter()
router.register(r'payments', PaymentViewSet)

urlpatterns = [path('', include(router.urls))]
