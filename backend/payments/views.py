from rest_framework import viewsets
from .models import Payment
from .serializers import PaymentSerializer
from common.permissions import IsAdminOrTeacherReadOnly

class PaymentViewSet(viewsets.ModelViewSet):
    queryset = Payment.objects.all().order_by('-date','-created_at')
    serializer_class = PaymentSerializer
    permission_classes = [IsAdminOrTeacherReadOnly]

    def get_queryset(self):
        qs = super().get_queryset()
        user = self.request.user
        if user.is_authenticated and user.is_teacher():
            return qs.filter(student__group__teacher=user)
        return qs
