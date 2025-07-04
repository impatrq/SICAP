from django.contrib import admin
from django.urls import path, include
from django.http import HttpResponse

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/recibir/', include('registros.urls')),  # o como tengas configurado
    path('', lambda request: HttpResponse("¡Bienvenido a la página principal!")),  # Ruta principal
]
