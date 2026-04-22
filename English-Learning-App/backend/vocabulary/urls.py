from django.urls import path,include
from rest_framework.routers import DefaultRouter
from.views import CategoryViewSet,WordViewSet

router = DefaultRouter()
router.register('categories',CategoryViewSet)
router.register('words',WordViewSet)


urlpatterns = [
    path('', include(router.urls))
]