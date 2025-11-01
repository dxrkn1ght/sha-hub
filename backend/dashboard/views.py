from django.shortcuts import render
from .models import Course, Student

def index(request):
    courses = Course.objects.all()[:10]
    students = Student.objects.all()[:10]
    return render(request, 'dashboard/index.html', {'courses': courses, 'students': students})
