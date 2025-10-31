from rest_framework import serializers
from .models import StudentProfile
from users.serializers import UserSerializer

class StudentCreateSerializer(serializers.ModelSerializer):
    username = serializers.CharField(write_only=True)
    password = serializers.CharField(write_only=True)
    first_name = serializers.CharField(write_only=True)
    last_name = serializers.CharField(write_only=True)
    phone = serializers.CharField(write_only=True, required=False)

    class Meta:
        model = StudentProfile
        fields = ['id','username','password','first_name','last_name','phone','group','joined_date']

    def create(self, validated_data):
        from users.models import CustomUser
        username = validated_data.pop('username')
        password = validated_data.pop('password')
        first_name = validated_data.pop('first_name')
        last_name = validated_data.pop('last_name')
        phone = validated_data.pop('phone', '')
        user = CustomUser.objects.create(username=username, first_name=first_name, last_name=last_name, role='student', phone=phone)
        user.set_password(password)
        user.save()
        student = StudentProfile.objects.create(user=user, **validated_data)
        return student

class StudentSerializer(serializers.ModelSerializer):
    user = UserSerializer(read_only=True)
    balance = serializers.SerializerMethodField()

    class Meta:
        model = StudentProfile
        fields = ['id','user','group','joined_date','attendance_count','balance']

    def get_balance(self, obj):
        from django.db.models import Sum
        payments = obj.payments.all()
        total_paid = payments.aggregate(total=Sum('amount'))['total'] or 0
        default_tuition = 600000
        group_tuition = getattr(obj.group, 'tuition', None)
        tuition = group_tuition or default_tuition
        remaining = tuition - total_paid
        return {'tuition': tuition, 'total_paid': total_paid, 'remaining': max(remaining, 0)}
