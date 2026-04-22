from rest_framework import serializers
from .models import QuizResult

class QuizResultSerializer(serializers.ModelSerializer):
    class Meta:
        model = QuizResult
        fields = ['id', 'user', 'score', 'total_questions', 'percentage', 'date_completed']
        read_only_fields = ['date_completed']