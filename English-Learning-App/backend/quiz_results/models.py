from django.db import models
from django.contrib.auth.models import User

class QuizResult(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, null=True, blank=True)
    
    score = models.IntegerField(default=0)
    total_questions = models.IntegerField(default=0)
    percentage = models.FloatField(default=0.0)
    date_completed = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Quiz Score: {self.score}/{self.total_questions}"