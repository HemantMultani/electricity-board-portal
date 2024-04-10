from rest_framework import serializers
from .models import Application


class ApplicationSerializer(serializers.ModelSerializer):
    class Meta:
        model = Application
        fields = '__all__'


class RequestsGraphFieldSerializer(serializers.Serializer):
    name = serializers.CharField()
    value = serializers.IntegerField()


class MonthlyRequestsCountSerializer(serializers.Serializer):
    years = serializers.ListField(child=serializers.IntegerField())
    statuses = serializers.ListField(child=serializers.CharField())
    data = RequestsGraphFieldSerializer(many=True)