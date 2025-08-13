from django.contrib import admin
from django.urls import path
from django.contrib.auth import views as auth_views
from .pages import dashboard

# (Si ya tenés la API por cookie y querés mantenerla)
from .auth_views import csrf, login_api, me, logout_api

urlpatterns = [
    path('admin/', admin.site.urls),

    # Pantallas HTML
    path('login/',  auth_views.LoginView.as_view(template_name='login.html'), name='login'),
    path('logout/', auth_views.LogoutView.as_view(), name='logout'),
    path('dashboard/', dashboard, name='dashboard'),

    # API de autenticación para el frontend (opcional, ya la tenías funcionando)
    path('api/auth/csrf/', csrf),
    path('api/auth/login/', login_api),
    path('api/auth/me/', me),
    path('api/auth/logout/', logout_api),
]

