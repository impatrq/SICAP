from django.http import JsonResponse
from django.views.decorators.http import require_GET
from rest_framework.decorators import api_view, permission_classes
from django.views.decorators.csrf import csrf_exempt, ensure_csrf_cookie
from django.db.models import F
from django.utils.timezone import localtime
from django.utils import timezone
from rest_framework.response import Response
from rest_framework import status
from rest_framework import viewsets, mixins, status
from rest_framework.viewsets import ModelViewSet
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticatedOrReadOnly, AllowAny
from .models import RegistroTag, Panol, Asignacion
from django.shortcuts import get_object_or_404
from .serializer import PanolSerializer, RegistroTagSerializer, AsignacionSerializer
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


@api_view(['POST'])
@permission_classes([AllowAny])
def assignments_auto(request):
    data = request.data or {}
    persona_tag = str(data.get('persona_tag', '')).strip()
    persona_nombre = (data.get('persona_nombre') or '').strip() or None
    items = data.get('items') or []

    if not persona_tag or not items:
        return Response({'error': 'persona_tag e items son obligatorios'}, status=400)

    asignados, devueltos = []

    for it in items:
        item_tag = str((it or {}).get('tag', '')).strip()
        item_nombre = ((it or {}).get('nombre') or '').strip() or None
        if not item_tag:
            continue

        
        a = Asignacion.objects.filter(persona_tag=persona_tag, item_tag=item_tag, activo=True).first()

        if a:
            
            a.activo = False
            a.devuelto_en = timezone.now()
            a.save(update_fields=['activo', 'devuelto_en'])
            devueltos.append({
                'id': a.id,
                'item_tag': item_tag,
                'item_nombre': item_nombre or a.item_nombre,
                'devuelto_en': a.devuelto_en,
            })
        else:
            Asignacion.objects.filter(item_tag=item_tag, activo=True).update(
                activo=False,
                devuelto_en=timezone.now()
            )

            a = Asignacion.objects.create(
                persona_tag=persona_tag,
                persona_nombre=persona_nombre,
                item_tag=item_tag,
                item_nombre=item_nombre,
                asignado_en=timezone.now(),
                activo=True
            )
            asignados.append({
                'id': a.id,
                'item_tag': item_tag,
                'item_nombre': item_nombre,
                'asignado_en': a.asignado_en,
            })

    return Response({
        'status': 'ok',
        'persona_tag': persona_tag,
        'persona_nombre': persona_nombre,
        'asignados': asignados,
        'devueltos': devueltos,
        'total_asignados': len(asignados),
        'total_devueltos': len(devueltos),
    }, status=200)


@api_view(['GET'])
@permission_classes([AllowAny])
def assignments_list(request):
    qs = Asignacion.objects.all().order_by('-asignado_en')
    activo = request.GET.get('activo')
    if activo is not None:
        qs = qs.filter(activo=(str(activo).lower() in ['1','true','t','yes','y']))
    persona_tag = request.GET.get('persona_tag')
    if persona_tag:
        qs = qs.filter(persona_tag=persona_tag)
    ser = AsignacionSerializer(qs, many=True)
    return Response(ser.data)


@api_view(['PUT'])
@permission_classes([AllowAny])
def assignments_devolver(request, pk: int):
    a = Asignacion.objects.filter(pk=pk, activo=True).first()
    if not a:
        return Response({'error': 'asignación no encontrada o ya devuelta'}, status=404)
    a.activo = False
    a.devuelto_en = timezone.now()
    a.save()
    return Response(AsignacionSerializer(a).data)



class PanolViewSet(ModelViewSet):
    queryset = Panol.objects.all().order_by('nombre')
    serializer_class = PanolSerializer
    permission_classes = [AllowAny]

class RegistroTagViewSet(mixins.CreateModelMixin, mixins.ListModelMixin,viewsets.GenericViewSet):
    
    queryset = RegistroTag.objects.all().order_by('-fecha_hora')
    serializer_class = RegistroTagSerializer
    permission_classes = [AllowAny]	

