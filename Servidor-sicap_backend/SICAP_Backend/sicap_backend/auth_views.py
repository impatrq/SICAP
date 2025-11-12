"""
Vistas mínimas de autenticación usadas por el backend.

Proveen endpoints sencillos para:
- asegurar la cookie CSRF para clientes (csrf)
- login via POST (login_api)
- información del usuario autenticado (me)

Estas vistas son deliberadamente simples y están pensadas para el
cliente Ionic del proyecto, no como un sistema de auth completo.
"""

from django.views.decorators.csrf import csrf_exempt, ensure_csrf_cookie
from django.http import JsonResponse
from django.contrib.auth import authenticate, login, logout
from django.contrib.auth.decorators import login_required
from django.middleware.csrf import get_token
import json


@ensure_csrf_cookie
def csrf(request):
    # Endpoint que asegura la cookie CSRF y devuelve el token para uso
    # del cliente si lo necesita.
    return JsonResponse({"csrfToken": get_token(request)})


@csrf_exempt
def login_api(request):
    if request.method != "POST":
        return JsonResponse({"ok": False, "error": "POST only"}, status=405)
    try:
        data = json.loads(request.body.decode("utf-8"))
        user = authenticate(
            username=data.get("username"), password=data.get("password")
        )
        if user is None:
            return JsonResponse(
                {"ok": False, "error": "Credenciales inválidas"}, status=401
            )
        # Crea la sesión del usuario en Django
        login(request, user)
        return JsonResponse(
            {"ok": True, "user": {"id": user, "username": user.username}}
        )
    except Exception as e:
        return JsonResponse({"ok": False, "error": str(e)}, status=400)


@login_required
def me(request):
    # Devuelve información básica del usuario autenticado (para debug/client)
    u = request.user
    return JsonResponse({"ok": True, "user": {"id": u.id, "username": u.username}})


def logout_api(request):
    logout(request)
    return JsonResponse({"ok": True})
