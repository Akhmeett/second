from django.urls import path
from .views import QuizResultCreateView

urlpatterns = [
    path('save-result/', QuizResultCreateView.as_view(), name='save-result'),
]