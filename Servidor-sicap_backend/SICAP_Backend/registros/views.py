from django.http import JsonResponse
from django.views.decorators.http import require_GET
from django.views.decorators.csrf import csrf_exempt, ensure_csrf_cookie
from django.db.models import F
from django.utils.timezone import localtime
from rest_framework import viewsets, mixins
from rest_framework.viewsets import ModelViewSet
from rest_framework.permissions import IsAuthenticatedOrReadOnly, AllowAny
from .models import RegistroTag, Panol
from django.shortcuts import get_object_or_404
from .serializer import PanolSerializer, RegistroTagSerializer
import json

@csrf_exempt
def recibir_tag(request):
	if request.method == 'POST':
		try:
			data = json.loads(request.body)
			tag = data.get('tag')
			print(tag)
			if tag:
				RegistroTag.objects.create(tag=tag)
				return JsonResponse({'status': 'ok'})
			else:
				return JsonResponse({'error': 'tag faltante'}, status=400)
		except Exception as e:
			return JsonResponse({'error': str(e)}, status=500)

	return JsonResponse({'error': 'método no permitido'}, status=405)

@csrf_exempt
def editar_tag(request, id):
    if request.method == 'PUT':
        tag_obj = get_object_or_404(RegistroTag, pk=id)
        data = json.loads(request.body or "{}")

        if 'nombre' in data:
            tag_obj.nombre = data['nombre']

        if 'categoria' in data:
            raw = data['categoria']
            if raw in (None, '', 'null'):
                tag_obj.categoria = None
            else:
                categoria = str(raw).lower().strip()
                if categoria not in ['persona', 'insumo']:
                    return JsonResponse({
                        'error': 'valor de categoría inválido. Debe ser "persona" o "insumo".'
                    }, status=400)
            tag_obj.categoria = categoria

        tag_obj.save()
        return JsonResponse({
            'status': 'ok',
            'id': tag_obj.id,
            'nombre': tag_obj.nombre,
            'categoria': tag_obj.categoria,
        })
    return JsonResponse({'error': 'Método no permitido'}, status=405)

@ensure_csrf_cookie
def csrf_ping(request):
    
    return JsonResponse({"detail": "ok"})

@require_GET
def listar_tags(request):
    rows = list(
        RegistroTag.objects
        .order_by("-fecha_hora")
        .values("id", "tag", "nombre", "fecha_hora", "categoria")[:200]
    )
    for r in rows:
        r["created_at"] = localtime(r["fecha_hora"]).strftime("%Y-%m-%d %H:%M:%S")
        del r["fecha_hora"]

    return JsonResponse(rows, safe=False)

class PanolViewSet(ModelViewSet):
    queryset = Panol.objects.all().order_by('nombre')
    serializer_class = PanolSerializer
    permission_classes = [AllowAny]

class RegistroTagViewSet(mixins.CreateModelMixin, mixins.ListModelMixin,viewsets.GenericViewSet):
    
    queryset = RegistroTag.objects.all().order_by('-fecha_hora')
    serializer_class = RegistroTagSerializer
    permission_classes = [AllowAny]	

