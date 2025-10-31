from rest_framework import viewsets
from .models import Group
from .serializers import GroupSerializer
from common.permissions import IsAdminOrTeacherReadOnly

class GroupViewSet(viewsets.ModelViewSet):
    queryset = Group.objects.all().order_by('-created_at')
    serializer_class = GroupSerializer
    permission_classes = [IsAdminOrTeacherReadOnly]
