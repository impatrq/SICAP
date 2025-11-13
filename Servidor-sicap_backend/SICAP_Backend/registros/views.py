from django.http import JsonResponse
from rest_framework.decorators import api_view, permission_classes
from django.views.decorators.csrf import csrf_exempt, ensure_csrf_cookie
from django.views.decorators.http import require_GET
from django.db.models import Q, Max
from django.shortcuts import get_object_or_404
from django.utils import timezone
from django.utils.timezone import localtime
from rest_framework.response import Response
from rest_framework.permissions import AllowAny
from rest_framework.viewsets import ModelViewSet
from rest_framework import mixins, viewsets
from .models import RegistroTag, Panol, Asignacion, PersonaSesion
from .serializer import PanolSerializer, RegistroTagSerializer, AsignacionSerializer
import json


def _norm_cat(raw):
    """Normaliza categoría: solo 'persona' o 'insumo'."""
    if raw is None:
        return None
    k = str(raw).strip().lower()
    if k in (
        "objeto",
        "object",
        "item",
        "herramienta",
        "herramientas",
        "tool",
        "tools",
    ):
        return "insumo"
    if k in ("persona", "person", "usuario", "user", "empleado", "empleados"):
        return "persona"
    if k == "insumo":
        return "insumo"
    return None


@csrf_exempt
def recibir_tag(request):
    """Endpoint principal para recibir tags escaneados."""
    if request.method != "POST":
        return JsonResponse({"error": "método no permitido"}, status=405)
    try:
        data = json.loads(request.body or "{}")
    except Exception as e:
        return JsonResponse({"error": f"json inválido: {e}"}, status=400)

    tag = str(data.get("tag", "")).strip()
    if not tag:
        return JsonResponse({"error": "tag faltante"}, status=400)

    nombre = (data.get("nombre") or "").strip() or None
    categoria_recibida = _norm_cat(data.get("categoria"))
    now = timezone.now()

    reg, created = RegistroTag.objects.get_or_create(
        tag=tag,
        defaults={"nombre": nombre, "categoria": categoria_recibida, "fecha_hora": now},
    )

    if not created:
        if nombre:
            reg.nombre = nombre
        if categoria_recibida in ("persona", "insumo"):
            reg.categoria = categoria_recibida
        reg.fecha_hora = now
        reg.save(update_fields=["nombre", "categoria", "fecha_hora"])
        RegistroTag.objects.filter(tag=tag).exclude(id=reg.id).delete()

    categoria = reg.categoria

    # Lógica para personas
    if categoria == "persona":
        PersonaSesion.objects.filter(activa=True).update(activa=False, fin=now)
        sesion = PersonaSesion.objects.create(
            persona_tag=tag, nombre=nombre, inicio=now, activa=True
        )
        return JsonResponse(
            {
                "status": "ok",
                "accion": "sesion_abierta",
                "persona_tag": tag,
                "sesion_id": sesion.id,
            }
        )

    # Lógica para insumos
    if categoria == "insumo":
        sesion = PersonaSesion.objects.filter(activa=True).order_by("-inicio").first()

        if not sesion:
            return JsonResponse({"status": "ok", "accion": "sin_sesion_persona"})

        asig_activa = Asignacion.objects.filter(item_tag=tag, activo=True).first()

        if asig_activa:
            # Toggle: devolver
            asig_activa.activo = False
            asig_activa.devuelto_en = now
            asig_activa.save()
            return JsonResponse(
                {
                    "status": "ok",
                    "accion": "asignacion_cerrada",
                    "item_tag": tag,
                    "item_nombre": asig_activa.item_nombre,
                    "persona_tag": asig_activa.persona_tag,
                    "persona_nombre": asig_activa.persona_nombre,
                }
            )
        else:
            # Toggle: asignar
            asig = Asignacion.objects.create(
                persona_tag=sesion.persona_tag,
                persona_nombre=sesion.nombre,
                item_tag=tag,
                item_nombre=reg.nombre,
                asignado_en=now,
                activo=True,
            )
            return JsonResponse(
                {
                    "status": "ok",
                    "accion": "asignacion_creada",
                    "item_tag": tag,
                    "persona_tag": sesion.persona_tag,
                }
            )

    return JsonResponse({"status": "ok"})


@csrf_exempt
def editar_tag(request, id):
    """Edita nombre y/o categoría de un tag."""
    if request.method != "PUT":
        return JsonResponse({"error": "Método no permitido"}, status=405)

    tag_obj = get_object_or_404(RegistroTag, pk=id)
    try:
        data = json.loads(request.body or "{}")
    except Exception:
        return JsonResponse({"error": "JSON inválido"}, status=400)

    if "nombre" in data:
        tag_obj.nombre = data["nombre"]

    if "categoria" in data:
        raw = data["categoria"]
        if raw in (None, "", "null"):
            tag_obj.categoria = None
        else:
            categoria = str(raw).lower().strip()
            if categoria not in ["persona", "insumo"]:
                return JsonResponse(
                    {"error": 'Categoría debe ser "persona" o "insumo"'}, status=400
                )
            tag_obj.categoria = categoria

    tag_obj.save()
    return JsonResponse(
        {
            "status": "ok",
            "id": tag_obj.id,
            "nombre": tag_obj.nombre,
            "categoria": tag_obj.categoria,
        }
    )


@csrf_exempt
def eliminar_tag(request, id):
    """Elimina un tag. Requiere force=1 si hay asignaciones activas."""
    if request.method not in ("DELETE", "POST"):
        return JsonResponse({"error": "Método no permitido"}, status=405)

    tag_obj = get_object_or_404(RegistroTag, pk=id)
    force = False

    try:
        if request.method == "POST":
            body = json.loads(request.body or "{}")
            force = bool(body.get("force", False))
    except Exception:
        pass

    if request.GET.get("force") in ("1", "true", "True", "yes", "y"):
        force = True

    tiene_activos = Asignacion.objects.filter(
        Q(persona_tag=tag_obj.tag) | Q(item_tag=tag_obj.tag), activo=True
    ).exists()

    if tiene_activos and not force:
        return JsonResponse(
            {"error": "Hay asignaciones activas. Usa force=1 para forzar"}, status=409
        )

    tag_obj.delete()
    return JsonResponse({"status": "ok", "borrados": 1})


@require_GET
def listar_tags(request):
    """Lista los tags más recientes (uno por tag)."""
    latest_ids = (
        RegistroTag.objects.values("tag")
        .annotate(max_id=Max("id"))
        .values_list("max_id", flat=True)
    )
    rows = list(
        RegistroTag.objects.filter(id__in=latest_ids)
        .order_by("-fecha_hora")
        .values("id", "tag", "nombre", "fecha_hora", "categoria")
    )
    for r in rows:
        r["created_at"] = localtime(r["fecha_hora"]).strftime("%Y-%m-%d %H:%M:%S")
        del r["fecha_hora"]
    return JsonResponse(rows, safe=False)


@ensure_csrf_cookie
def csrf_ping(request):
    """Endpoint para obtener token CSRF."""
    return JsonResponse({"detail": "ok"})


@api_view(["GET"])
@permission_classes([AllowAny])
def assignments_list(request):
    """Lista asignaciones, filtrable por activo y persona_tag."""
    qs = Asignacion.objects.all().order_by("-asignado_en")

    activo = request.GET.get("activo")
    if activo is not None:
        qs = qs.filter(activo=(str(activo).lower() in ["1", "true", "t", "yes", "y"]))

    persona_tag = request.GET.get("persona_tag")
    if persona_tag:
        qs = qs.filter(persona_tag=persona_tag)

    ser = AsignacionSerializer(qs, many=True)
    return Response(ser.data)


@api_view(["PUT"])
@permission_classes([AllowAny])
def assignments_devolver(request, pk: int):
    """Marca una asignación como devuelta."""
    a = Asignacion.objects.filter(pk=pk, activo=True).first()
    if not a:
        return Response({"error": "Asignación no encontrada"}, status=404)

    a.activo = False
    a.devuelto_en = timezone.now()
    a.save()
    return Response(AsignacionSerializer(a).data)


@api_view(["POST"])
@permission_classes([AllowAny])
def assignments_auto(request):
    """Asigna/devuelve múltiples items en una llamada."""
    data = request.data or {}
    persona_tag = str(data.get("persona_tag", "")).strip()
    persona_nombre = (data.get("persona_nombre") or "").strip() or None
    items = data.get("items") or []

    if not persona_tag or not items:
        return Response({"error": "persona_tag e items son obligatorios"}, status=400)

    asignados = []
    devueltos = []
    now = timezone.now()

    for it in items:
        item_tag = str((it or {}).get("tag", "")).strip()
        item_nombre = ((it or {}).get("nombre") or "").strip() or None
        if not item_tag:
            continue

        a = Asignacion.objects.filter(
            persona_tag=persona_tag, item_tag=item_tag, activo=True
        ).first()

        if a:
            a.activo = False
            a.devuelto_en = now
            a.save()
            devueltos.append(
                {
                    "id": a.id,
                    "item_tag": item_tag,
                    "item_nombre": item_nombre or a.item_nombre,
                }
            )
        else:
            Asignacion.objects.filter(item_tag=item_tag, activo=True).update(
                activo=False, devuelto_en=now
            )
            a = Asignacion.objects.create(
                persona_tag=persona_tag,
                persona_nombre=persona_nombre,
                item_tag=item_tag,
                item_nombre=item_nombre,
                asignado_en=now,
                activo=True,
            )
            asignados.append(
                {
                    "id": a.id,
                    "item_tag": item_tag,
                    "item_nombre": item_nombre,
                }
            )

    return Response(
        {
            "status": "ok",
            "persona_tag": persona_tag,
            "asignados": asignados,
            "devueltos": devueltos,
        }
    )


@csrf_exempt
def bulk_delete_uncategorized_tags(request):
    """Borra masivamente tags sin categoría."""
    if request.method != "POST":
        return JsonResponse({"error": "Método no permitido"}, status=405)

    try:
        data = json.loads(request.body or "{}")
    except Exception:
        return JsonResponse({"error": "JSON inválido"}, status=400)

    tags = data.get("tags") or []
    if not isinstance(tags, list):
        return JsonResponse({"error": "tags debe ser una lista"}, status=400)

    tags = [str(t).strip() for t in tags if str(t).strip()]
    if not tags:
        return JsonResponse({"status": "ok", "borrados": 0})

    borrados, _ = RegistroTag.objects.filter(
        tag__in=tags, categoria__isnull=True
    ).delete()

    return JsonResponse({"status": "ok", "borrados": borrados})


class PanolViewSet(ModelViewSet):
    """ViewSet para gestión de pañoles."""

    queryset = Panol.objects.all().order_by("nombre")
    serializer_class = PanolSerializer
    permission_classes = [AllowAny]


class RegistroTagViewSet(
    mixins.CreateModelMixin, mixins.ListModelMixin, viewsets.GenericViewSet
):
    """ViewSet para listar y crear registros de tags."""

    queryset = RegistroTag.objects.all().order_by("-fecha_hora")
    serializer_class = RegistroTagSerializer
    permission_classes = [AllowAny]
