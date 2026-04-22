from rest_framework import generics
from .models import QuizResult
from .serializers import QuizResultSerializer

class QuizResultCreateView(generics.CreateAPIView):
    queryset = QuizResult.objects.all()
    serializer_class = QuizResultSerializer

    def perform_create(self, serializer):
        if self.request.user.is_authenticated:
            serializer.save(user=self.request.user)
        else:
            serializer.save()