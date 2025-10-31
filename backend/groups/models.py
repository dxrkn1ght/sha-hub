from django.db import models

class Group(models.Model):
    name = models.CharField(max_length=255)
    schedule = models.CharField(max_length=255, blank=True)
    teacher = models.ForeignKey('users.CustomUser', on_delete=models.SET_NULL, null=True, blank=True, limit_choices_to={'role':'teacher'})
    status = models.CharField(max_length=50, default='active')
    tuition = models.PositiveIntegerField(default=0)  # optional per-group override
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.name
