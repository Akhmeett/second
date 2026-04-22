from rest_framework import serializers
from .models import QuizWord

class QuizWordSerializer(serializers.ModelSerializer):
    class Meta:
        model = QuizWord
        fields = '__all__'