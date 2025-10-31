from rest_framework import serializers
from .models import Payment

class PaymentSerializer(serializers.ModelSerializer):
    remaining_after = serializers.SerializerMethodField(read_only=True)

    class Meta:
        model = Payment
        fields = ['id','student','payment_type','method','amount','date','note','created_at','remaining_after']

    def get_remaining_after(self, obj):
        total_paid = obj.total_paid_for_type()
        return max(obj.required_amount() - total_paid, 0)

    def create(self, validated_data):
        payment = super().create(validated_data)
        return payment
