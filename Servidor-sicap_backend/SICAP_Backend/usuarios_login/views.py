from django.http import JsonResponse
from rest_framework import viewsets, status
from .serializer import ProgrammerSerializer, UserCreateSerializer, PañolSerializer
from .models import Programmer, Pañol
import json
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAdminUser
from django.views.decorators.csrf import csrf_exempt
from django.contrib.auth import authenticate 
from rest_framework.permissions import IsAuthenticated 


class ProgrammerViewSet(viewsets.ModelViewSet):
    queryset = Programmer.objects.all()
    serializer_class = ProgrammerSerializer

@csrf_exempt
def login_view(request):
    if request.method == 'POST':
        data = json.loads(request.body)
        username = data.get('username')
        password = data.get('password')

        user = authenticate(request, username=username, password=password)

        if user is not None:
            
            return JsonResponse({'success': True, 'message': 'Login correcto'})
        else:
            
            return JsonResponse({'success': False, 'message': 'Datos Incorrectos'})
            
    return JsonResponse({'error': 'Método no permitido'}, status=405)

class UserCreateAPIView(APIView):

    permission_classes = [IsAdminUser]

    def post(self, request):
        serializer = UserCreateSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class MisPañolesAPIView(APIView):
    
    permission_classes = [IsAuthenticated]

    def get(self, request):
        
        panoles = Pañol.objects.filter(usuario=request.user)
        serializer = PañolSerializer(panoles, many=True)
        return Response(serializer.data)