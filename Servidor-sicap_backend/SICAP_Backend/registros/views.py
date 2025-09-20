from django.http import JsonResponse
from django.views.decorators.http import require_GET
from django.views.decorators.csrf import csrf_exempt
from rest_framework.viewsets import ModelViewSet
from rest_framework.permissions import IsAuthenticatedOrReadOnly
from django.db.models import F
from .models import Panol
from .serializer import PanolSerializer
import json
from .models import RegistroTag

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
