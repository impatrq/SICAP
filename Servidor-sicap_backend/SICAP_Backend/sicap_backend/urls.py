from django.contrib import admin
from django.urls import path, include

urlpatterns = [
    path('admin/', admin.site.urls),
    path('usuarios/', include('usuarios_login.urls')),
    path('api/v1/', include('registros.urls')),
]
