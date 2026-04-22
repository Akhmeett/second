from django.db import models
from django.db.models.signals import post_save
from django.dispatch import receiver

class QuizWord(models.Model):
    LEVEL_CHOICES = [
        ('A1', 'A1'),
        ('A2', 'A2'),
        ('B1', 'B1'),
    ]
    
    english = models.CharField(max_length=200)
    kazakh = models.CharField(max_length=200)
    level = models.CharField(max_length=10, choices=LEVEL_CHOICES, default='A1')

    def __str__(self):
        return self.english

@receiver(post_save, sender='vocabulary.Word')
def copy_to_quiz(sender, instance, created, **kwargs):
    if created:  # только при создании нового слова
        QuizWord.objects.get_or_create(
            english=instance.english,
            defaults={
                'kazakh': instance.kazakh,
                'level': instance.level,
            }
        )