from rest_framework import viewsets
from .models import TeacherProfile
from .serializers import TeacherSerializer
from common.permissions import IsAdminOrTeacherReadOnly

class TeacherViewSet(viewsets.ModelViewSet):
    queryset = TeacherProfile.objects.all()
    serializer_class = TeacherSerializer
    permission_classes = [IsAdminOrTeacherReadOnly]
