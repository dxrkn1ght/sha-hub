from django.db import models

class StudentProfile(models.Model):
    user = models.OneToOneField('users.CustomUser', on_delete=models.CASCADE, limit_choices_to={'role':'student'})
    group = models.ForeignKey('groups.Group', on_delete=models.SET_NULL, null=True, blank=True)
    joined_date = models.DateField(null=True, blank=True)
    attendance_count = models.IntegerField(default=0)

    def __str__(self):
        return f"{self.user.first_name} {self.user.last_name}"
