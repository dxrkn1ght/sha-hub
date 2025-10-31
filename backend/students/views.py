from rest_framework import viewsets
from .models import StudentProfile
from .serializers import StudentSerializer, StudentCreateSerializer
from common.permissions import IsAdminOrTeacherReadOnly

class StudentViewSet(viewsets.ModelViewSet):
    queryset = StudentProfile.objects.all()
    permission_classes = [IsAdminOrTeacherReadOnly]

    def get_serializer_class(self):
        if self.action in ['create']:
            return StudentCreateSerializer
        return StudentSerializer

    def get_queryset(self):
        qs = super().get_queryset()
        user = self.request.user
        if user.is_authenticated and user.is_teacher():
            return qs.filter(group__teacher=user)
        return qs
