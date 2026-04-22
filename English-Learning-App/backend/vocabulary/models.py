from django.db import models
from django.conf import settings 

# Create your models here.

class Category(models.Model):
    name = models.CharField(max_length=50)
    
    def __str__(self):
        return self.name
class Word(models.Model):
    
    LEVEL_CHOICES = [
        ('A1', 'A1'),
        ('A2', 'A2'),
        ('B1', 'B1'),
    ]
    
    english = models.CharField(max_length=200)
    kazakh = models.CharField(max_length=200)
    example = models.TextField(blank=True)
    level = models.CharField(max_length=10, choices=LEVEL_CHOICES, default='A1')
    category = models.ForeignKey(Category, on_delete=models.CASCADE, null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, null=True, blank=True)
        
    def __str__(self):
        return self.english