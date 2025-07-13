from rest_framework import viewsets
from.serializer import ProgrammerSerializer
from .models import Programmer
from django.contrib.auth.forms import UserCreationForm
from django.shortcuts import render, redirect   
# Create your views here.
 
class ProgrammerViewSet(viewsets.ModelViewSet):
    queryset = Programmer.objects.all()
    serializer_class = ProgrammerSerializer
    
def register_view(request):
    if request.method == 'GET':
        form = UserCreationForm(request.GET)
        if form.is_valid():
            form.save()
            return redirect('usuarios_login:programmer-list')
        else:
            form = UserCreationForm()
        return render(request, "Web-app/web-app/src/app/login/login.page.html", {'form': form})