from django.contrib import admin
from django.views.decorators.csrf import ensure_csrf_cookie
from django.urls import path, include
from django.http import JsonResponse

def get_csrf(request):
    return JsonResponse({"detail": "CSRF Cookie Set"})

def home(request):
		return JsonResponse({"status":"ok","message":"SICAP Backend activo"})
urlpatterns = [
		path('',home),
    path('admin/', admin.site.urls),
    path('usuarios/', include('usuarios_login.urls')),
    path('api/v1/', include('registros.urls')),    
    path('api/v1/csrf/', ensure_csrf_cookie(get_csrf)),

]
