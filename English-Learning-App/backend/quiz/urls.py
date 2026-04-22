from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import QuizWordViewSet

router = DefaultRouter()
router.register('words', QuizWordViewSet)

urlpatterns = [
    path('', include(router.urls))
]