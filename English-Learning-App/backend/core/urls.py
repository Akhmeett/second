from django.contrib import admin
from django.urls import path, include

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/users/', include('users.urls')),
    path('api/vocabulary/', include('vocabulary.urls')),
    path('api/quiz/', include('quiz.urls')),
    path('api/quiz/', include('quiz_results.urls')),  # ← добавьте
]