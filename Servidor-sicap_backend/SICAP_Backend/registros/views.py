from django.http import JsonResponse
from django.views.decorators.http import require_GET
from django.views.decorators.csrf import csrf_exempt, ensure_csrf_cookie
from rest_framework.viewsets import ModelViewSet
from rest_framework.permissions import IsAuthenticatedOrReadOnly
from django.db.models import F
from .serializer import PanolSerializer, RegistroSerializer
import json
from .models import RegistroTag, Panol
from rest_framework import viewsets

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

@ensure_csrf_cookie
def csrf_ping(request):
    
    return JsonResponse({"detail": "ok"})

@require_GET
def listar_tags(request):
    data = list(
        RegistroTag.objects.order_by('-fecha_hora')
        .values('id', 'tag')
				.annotate(created_at=F('fecha_hora'))
				[:200]
    )
    return JsonResponse(data, safe=False)

class PanolViewSet(ModelViewSet):
    queryset = Panol.objects.all().order_by('nombre')
    serializer_class = PanolSerializer
    permission_classes = [IsAuthenticatedOrReadOnly]

class RegistroViewSet(ModelViewSet):
    
    queryset = RegistroTag.objects.all().order_by('-fecha_hora')
    serializer_class = RegistroSerializer
    permission_classes = [IsAuthenticatedOrReadOnly]	

