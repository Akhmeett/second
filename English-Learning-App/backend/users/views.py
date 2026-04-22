from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework_simplejwt.tokens import RefreshToken
from .serializers import RegisterSerializer, LoginSerializer, ForgotPasswordSerializer
from django.conf import settings
from django.core.mail import send_mail
from .models import PasswordResetCode
import random

def get_tokens_for_user(user):
    refresh = RefreshToken.for_user(user)
    return {
        'refresh': str(refresh),
        'access': str(refresh.access_token),
    }

class RegisterView(APIView):
    def post(self, request):
        serializer = RegisterSerializer(data=request.data)
        if serializer.is_valid():
            user = serializer.save()
            tokens = get_tokens_for_user(user)
            return Response({'message': 'Тіркелу сәтті!', 'tokens': tokens}, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class LoginView(APIView):
    def post(self, request):
        serializer = LoginSerializer(data=request.data)
        if serializer.is_valid():
            user = serializer.validated_data['user']
            tokens = get_tokens_for_user(user)
            return Response({'message': 'Кіру сәтті!', 'tokens': tokens}, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    

from .models import PasswordResetCode # Жаңа модельді импорттау

class ForgotPasswordView(APIView):
    def post(self, request):
        email = request.data.get('email')
        
        if not email:
            return Response({'error': 'Email жазыңыз'}, status=status.HTTP_400_BAD_REQUEST)

        # 1. Кездейсоқ 6 таңбалы код жасау
        reset_code = str(random.randint(100000, 999999))
        
        # 2. Базада осы почтаға ескі кодтар болса, оларды өшіріп, жаңасын сақтау
        PasswordResetCode.objects.filter(email=email).delete()
        PasswordResetCode.objects.create(email=email, code=reset_code)
        
        # 3. Хат жіберу логикасы
        subject = 'Парольді қалпына келтіру коды'
        message = f'Сәлем! Парольді өзгерту үшін мына кодты қолданыңыз: {reset_code}'
        email_from = settings.EMAIL_HOST_USER
        
        try:
            send_mail(subject, message, email_from, [email])
            return Response({'message': 'Код почтаңызға сәтті жіберілді!'}, status=status.HTTP_200_OK)
        except Exception as e:
            return Response({'error': f'Хат жіберу кезінде қате шықты: {str(e)}'}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

class VerifyCodeView(APIView):
    def post(self, request):
        
        email = request.data.get('email', '').strip()
        code = str(request.data.get('code', '')).strip()
        new_password = request.data.get('new_password')

        print(f"DEBUG: Тексерілуде -> Email: '{email}', Code: '{code}'")

        
        reset_entry = PasswordResetCode.objects.filter(code=code).first()
        
        if not reset_entry:
            print("DEBUG: Мұндай код базада мүлдем жоқ.")
            return Response({'error': 'Код қате'}, status=400)
            
        if reset_entry.email != email:
            print(f"DEBUG: Код табылды, бірақ ол '{reset_entry.email}' почтасына тиесілі.")
            return Response({'error': 'Бұл код басқа почтаға жіберілген'}, status=400)

        
        from .models import CustomUser
        user = CustomUser.objects.filter(email=email).first()
        if user:
            user.set_password(new_password)
            user.save()
            reset_entry.delete()
            return Response({'message': 'Пароль сәтті өзгертілді!'}, status=status.HTTP_200_OK)
        
        return Response({'error': 'Пайдаланушы табылмады'}, status=404)