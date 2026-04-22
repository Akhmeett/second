from rest_framework import viewsets
from rest_framework.permissions import AllowAny
from .models import QuizWord
from .serializers import QuizWordSerializer

class QuizWordViewSet(viewsets.ModelViewSet):
    queryset = QuizWord.objects.all()
    serializer_class = QuizWordSerializer
    permission_classes = [AllowAny]

    def get_queryset(self):
        queryset = QuizWord.objects.all()
        level = self.request.query_params.get('level')
        if level:
            queryset = queryset.filter(level=level)
        return queryset