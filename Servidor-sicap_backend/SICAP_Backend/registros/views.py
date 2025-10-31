from django.http import JsonResponse
from django.views.decorators.http import require_GET
from rest_framework.decorators import api_view, permission_classes
from django.views.decorators.csrf import csrf_exempt, ensure_csrf_cookie
from django.db.models import F, Max
from django.utils.timezone import localtime
from django.utils import timezone
from rest_framework.response import Response
from rest_framework import status
from rest_framework import viewsets, mixins, status
from rest_framework.viewsets import ModelViewSet
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticatedOrReadOnly, AllowAny
from .models import RegistroTag, Panol, PersonaSesion, Asignacion
from django.shortcuts import get_object_or_404
from .serializer import PanolSerializer, RegistroTagSerializer, AsignacionSerializer
import json

def _norm_cat(raw):
    if raw is None:
        return None
    k = str(raw).strip().lower()
    if k == 'objeto':
        return 'insumo'
    if k in ('persona', 'insumo'):
        return k
    return None

def _log_registro(tag: str, nombre=None, categoria=None):
    return RegistroTag.objects.create(
        tag=tag,
        nombre=(nombre or None),
        categoria=_norm_cat(categoria)
    )

def _sesion_abierta():
    return PersonaSesion.objects.filter(activo=True).order_by('-opened_at').first()

def _abrir_sesion(persona_tag: str, persona_nombre: str | None):
    PersonaSesion.objects.filter(activo=True).update(activo=False, closed_at=timezone.now())
    return PersonaSesion.objects.create(
        persona_tag=persona_tag,
        persona_nombre=persona_nombre or None,
        opened_at=timezone.now(),
        activo=True
    )

def _ultimos_registros_desde(ts):
   
    sub = (RegistroTag.objects
           .filter(fecha_hora__gte=ts)
           .values('tag')
           .annotate(last_ts=Max('fecha_hora')))

    out = []
    for row in sub:
        tag = row['tag']
        last_ts = row['last_ts']
        r = (RegistroTag.objects
             .filter(tag=tag, fecha_hora=last_ts)
             .order_by('-id')
             .first())
        if r:
            out.append(r)
    return out

def _cerrar_sesion_y_asignar(sesion: PersonaSesion):

    now = timezone.now()
    creadas = []

    ultimos = _ultimos_registros_desde(sesion.opened_at)
    for r in ultimos:
        if _norm_cat(r.categoria) != 'insumo':
            continue

        # evitar duplicado activo para la misma persona
        if Asignacion.objects.filter(
            persona_tag=sesion.persona_tag, item_tag=r.tag, activo=True
        ).exists():
            continue

        # dar de baja asignaciones activas previas de ese item (si las hay)
        Asignacion.objects.filter(item_tag=r.tag, activo=True).update(
            activo=False,
            devuelto_en=now
        )

        a = Asignacion.objects.create(
            persona_tag=sesion.persona_tag,
            persona_nombre=sesion.persona_nombre,
            item_tag=r.tag,
            item_nombre=r.nombre or None,
            asignado_en=now,
            activo=True
        )
        creadas.append(a)

    sesion.activo = False
    sesion.closed_at = now
    sesion.save(update_fields=['activo', 'closed_at'])
    return creadas


@csrf_exempt
def recibir_tag(request):

    if request.method != 'POST':
        return JsonResponse({'error': 'método no permitido'}, status=405)

    try:
        data = json.loads(request.body or '{}')
    except Exception as e:
        return JsonResponse({'error': f'json inválido: {e}'}, status=400)

    tag = str(data.get('tag', '')).strip()
    if not tag:
        return JsonResponse({'error': 'tag faltante'}, status=400)

    nombre = (data.get('nombre') or '').strip() or None
    categoria = _norm_cat(data.get('categoria'))

    _log_registro(tag=tag, nombre=nombre, categoria=categoria)

    if categoria == 'persona':
        sesion = _sesion_abierta()

        if not sesion:
            nueva = _abrir_sesion(persona_tag=tag, persona_nombre=nombre)
            return JsonResponse({
                'status': 'ok',
                'accion': 'sesion_abierta',
                'persona_tag': nueva.persona_tag,
                'opened_at': nueva.opened_at.isoformat()
            })

        if sesion.persona_tag == tag:
            creadas = _cerrar_sesion_y_asignar(sesion)
            return JsonResponse({
                'status': 'ok',
                'accion': 'sesion_cerrada',
                'persona_tag': sesion.persona_tag,
                'asignados': [
                    {
                        'id': a.id,
                        'item_tag': a.item_tag,
                        'item_nombre': a.item_nombre,
                        'asignado_en': a.asignado_en.isoformat()
                    } for a in creadas
                ],
                'count': len(creadas)
            })

        _cerrar_sesion_y_asignar(sesion)
        nueva = _abrir_sesion(persona_tag=tag, persona_nombre=nombre)
        return JsonResponse({
            'status': 'ok',
            'accion': 'sesion_cambiada',
            'persona_tag': nueva.persona_tag,
            'opened_at': nueva.opened_at.isoformat()
        })

    return JsonResponse({'status': 'ok'})

@csrf_exempt
def editar_tag(request, id):
    if request.method != 'PUT':
        return JsonResponse({'error': 'Método no permitido'}, status=405)

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

    asignados = []
    devueltos = []
    now = timezone.now()

    for it in items:
        item_tag = str((it or {}).get('tag', '')).strip()
        item_nombre = ((it or {}).get('nombre') or '').strip() or None
        if not item_tag:
            continue

        a = Asignacion.objects.filter(persona_tag=persona_tag, item_tag=item_tag, activo=True).first()
        if a:
            a.activo = False
            a.devuelto_en = now
            a.save(update_fields=['activo', 'devuelto_en'])
            devueltos.append({
                'id': a.id,
                'item_tag': item_tag,
                'item_nombre': item_nombre or a.item_nombre,
                'devuelto_en': a.devuelto_en
            })
        else:
            Asignacion.objects.filter(item_tag=item_tag, activo=True).update(
                activo=False,
                devuelto_en=now
            )
            a = Asignacion.objects.create(
                persona_tag=persona_tag,
                persona_nombre=persona_nombre,
                item_tag=item_tag,
                item_nombre=item_nombre,
                asignado_en=now,
                activo=True
            )
            asignados.append({
                'id': a.id,
                'item_tag': item_tag,
                'item_nombre': item_nombre,
                'asignado_en': a.asignado_en
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

class RegistroTagViewSet(mixins.CreateModelMixin, mixins.ListModelMixin, viewsets.GenericViewSet):
    queryset = RegistroTag.objects.all().order_by('-fecha_hora')
    serializer_class = RegistroTagSerializer
    permission_classes = [AllowAny]