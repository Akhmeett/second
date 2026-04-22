from rest_framework import viewsets, permissions
from rest_framework.response import Response
from .models import Category, Word
from .serializers import CategorySerializer, WordSerializer
from rest_framework.permissions import AllowAny

class CategoryViewSet(viewsets.ModelViewSet):
    queryset = Category.objects.all()
    serializer_class = CategorySerializer

class WordViewSet(viewsets.ModelViewSet):
    permission_classes = [AllowAny]

class WordViewSet(viewsets.ModelViewSet):
    queryset = Word.objects.all()
    serializer_class = WordSerializer

    def perform_create(self, serializer):
        user = self.request.user if self.request.user.is_authenticated else None
        serializer.save(user=user)

    def get_queryset(self):
        queryset = Word.objects.all()
        category = self.request.query_params.get('category')
        level = self.request.query_params.get('level') # Добавляем получение уровня

        if category:
            queryset = queryset.filter(category__name=category)
        
        if level: # Если уровень передан в ссылке, фильтруем по нему
            queryset = queryset.filter(level=level)
            
        return queryset