from django.http import JsonResponse
from rest_framework import viewsets
from serializer.py import ProgrammerSerializer
from .models import Programmer
import json
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import IsAdminUser # Para proteger la ruta
from .serializers import UserCreateSerializer # El nuevo serializer que creamos
from django.views.decorators.csrf import csrf_exempt 




class ProgrammerViewSet(viewsets.ModelViewSet):
    queryset = Programmer.objects.all()
    serializer_class = ProgrammerSerializer

@csrf_exempt
def login_view(request):
    if request.method == 'POST':
        data = json.loads(request.body)
        username = data.get('username')
        password = data.get('password')
        # ADVERTENCIA: Este método de login es muy inseguro.
        # En el futuro, deberías usar el sistema de autenticación de Django.
        if username == "sicap" and password == "1234":
            return JsonResponse({'success': True, 'message': 'Login correcto'})
        else:
            return JsonResponse({'success': False, 'message': 'Credenciales incorrectas'})
    return JsonResponse({'error': 'Método no permitido'}, status=405)
    
def authenticate(request):
    data = {"status": "success", "message": "Authentication endpoint is not implemented yet."}
    return JsonResponse(data, status=200)

# --- NUEVA VISTA PARA LA API DE CREACIÓN DE USUARIOS ---

class UserCreateAPIView(APIView):
    """
    Esta es la 'puerta trasera' para crear nuevos usuarios.
    Solo los usuarios administradores pueden acceder a ella.
    """
    permission_classes = [IsAdminUser] # ¡Esto la hace segura!

    def post(self, request):
        serializer = UserCreateSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

# NOTA: La vista 'register_view' se ha eliminado porque no es segura
# y la nueva 'UserCreateAPIView' cumple su función de forma correcta y privada.