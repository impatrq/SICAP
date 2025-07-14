from django.http import JsonResponse
from rest_framework import viewsets
from.serializer import ProgrammerSerializer
from .models import Programmer
from django.contrib.auth.forms import UserCreationForm
from django.shortcuts import render, redirect   
from django.views.decorators.csrf import csrf_exempt
import json
# Create your views here.

class ProgrammerViewSet(viewsets.ModelViewSet):
    queryset = Programmer.objects.all()
    serializer_class = ProgrammerSerializer

@csrf_exempt
def login_view(request):
    if request.method == 'POST':
        data = json.loads(request.body)
        username = data.get('username')
        password = data.get('password')
        if username == "sicap" and password == "1234":
            return JsonResponse({'success': True, 'message': 'Login correcto'})
        else:
            return JsonResponse({'success': False, 'message': 'Credenciales incorrectas'})
    return JsonResponse({'error': 'Método no permitido'}, status=405)
    
def register_view(request):
    if request.method == 'GET':
        form = UserCreationForm(request.GET)
        if form.is_valid():
            form.save()
            return redirect('usuarios_login:programmer-list')
        else:
            form = UserCreationForm()
        return render(request, "Web-app/web-app/src/app/login/login.page.html", {'form': form})
    
    
def authenticate(request):
    
    
    data = {"status": "success", "message": "Authentication endpoint is not implemented yet."}
    return JsonResponse(data, status=200)