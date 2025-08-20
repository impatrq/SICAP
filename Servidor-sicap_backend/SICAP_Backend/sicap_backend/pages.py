from django.contrib.auth.decorators import login_required
from django.shortcuts import render

# Importá tu modelo real de registros (esto es lo usual en tu repo):
from registros.models import RegistroTag

@login_required
def dashboard(request):
    # Traemos los últimos 200 registros (ordenados por id descendente)
    registros = RegistroTag.objects.order_by('-id')[:200]
    return render(request, 'dashboard.html', {'registros': registros})

