from django.db import models

class TeacherProfile(models.Model):
    user = models.OneToOneField('users.CustomUser', on_delete=models.CASCADE, limit_choices_to={'role':'teacher'})
    bio = models.TextField(blank=True)
    def __str__(self):
        return f"{self.user.first_name} {self.user.last_name}"
