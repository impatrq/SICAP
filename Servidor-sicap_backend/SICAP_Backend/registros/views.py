from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
import json
from .models import RegistroTag

@csrf_exempt
def recibir_tag(request):
    if request.method == 'POST':
        try:
            data = json.loads(request.body)
            tag = data.get('tag')
            if tag:
                RegistroTag.objects.create(tag_id=tag)
                return JsonResponse({'status': 'ok'})
            else:
                return JsonResponse({'error': 'tag faltante'}, status=400)
        except Exception as e:
            return JsonResponse({'error': str(e)}, status=500)
    return JsonResponse({'error': 'método no permitido'}, status=405)
