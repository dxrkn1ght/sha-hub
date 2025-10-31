from django.contrib.auth.models import AbstractUser
from django.db import models

class CustomUser(AbstractUser):
    ROLE_CHOICES = (
        ('admin','Admin'),
        ('teacher','Teacher'),
        ('student','Student'),
    )
    role = models.CharField(max_length=20, choices=ROLE_CHOICES, default='student')
    phone = models.CharField(max_length=30, blank=True, null=True)

    def is_admin(self):
        return self.role == 'admin' or self.is_superuser
    def is_teacher(self):
        return self.role == 'teacher'
    def is_student(self):
        return self.role == 'student'
