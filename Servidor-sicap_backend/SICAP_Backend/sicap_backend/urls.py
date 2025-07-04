from django.contrib import admin
from django.urls import path, include



urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/recibir/', include('registros.urls')),  # o como tengas configurado
    path ('usuarios_login/v1/', include('usuarios_login.urls'))
]
