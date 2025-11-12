"""
Rutas del módulo `usuarios_login`.

Define las URL para login, creación de usuarios y la API de menú.
"""

from django.urls import path
from . import views

urlpatterns = [
    path("login/", views.login_view, name="login"),
    path("crear-usuario/", views.UserCreateAPIView.as_view(), name="create-user"),
    path("menú/", views.MenúAPIView.as_view(), name="menú"),
]
