from django.urls import path
from .views import RegisterView, LoginView, ForgotPasswordView,VerifyCodeView

urlpatterns = [
    path('register/', RegisterView.as_view(), name='register'),
    path('login/', LoginView.as_view(), name='login'),
    path('forgot-password/', ForgotPasswordView.as_view(), name='forgot-password'),
    path('forgot-password/', ForgotPasswordView.as_view(), name='forgot-password'),
    path('verify-code/', VerifyCodeView.as_view(), name='verify-code'),
]