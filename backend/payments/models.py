from django.db import models
from django.utils import timezone
from django.db.models import Sum

class PaymentMethod(models.TextChoices):
    CASH = 'cash', 'Cash'
    CARD = 'card', 'Card/Terminal'

class PaymentType(models.TextChoices):
    IELTS = 'ielts', 'IELTS (600000)'
    LOWER = 'lower', 'Lower (520000)'

TARIFFS = {
    PaymentType.IELTS: 600000,
    PaymentType.LOWER: 520000,
}

class Payment(models.Model):
    student = models.ForeignKey('students.StudentProfile', on_delete=models.CASCADE, related_name='payments')
    payment_type = models.CharField(max_length=20, choices=PaymentType.choices)
    method = models.CharField(max_length=20, choices=PaymentMethod.choices)
    amount = models.PositiveIntegerField()
    date = models.DateField(default=timezone.now)
    note = models.TextField(blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def required_amount(self):
        return TARIFFS.get(self.payment_type, 0)

    def total_paid_for_type(self):
        agg = Payment.objects.filter(student=self.student, payment_type=self.payment_type).aggregate(total=Sum('amount'))
        return agg['total'] or 0

    def remaining_for_type(self):
        return max(self.required_amount() - self.total_paid_for_type(), 0)

    def __str__(self):
        return f"{self.student} - {self.payment_type} - {self.amount}"
