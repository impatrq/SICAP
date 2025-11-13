from django.http import JsonResponse
from rest_framework.decorators import api_view, permission_classes
from django.views.decorators.csrf import csrf_exempt, ensure_csrf_cookie
from django.views.decorators.http import require_GET
from django.db.models import Q
from django.shortcuts import get_object_or_404
from django.utils import timezone
from django.utils.timezone import localtime
from rest_framework.response import Response
from rest_framework.permissions import AllowAny
from rest_framework.viewsets import ModelViewSet
from rest_framework import mixins, viewsets
from .models import RegistroTag, Panol, Asignacion
from .serializer import PanolSerializer, RegistroTagSerializer, AsignacionSerializer
import json
## Endpoints principales SICAP
def _norm_cat(raw):
    # Normaliza categoría: solo "persona" o "insumo"
    if raw is None:
        return None
    k = str(raw).strip().lower()
    if k in (
        "objeto", "object", "item", "herramienta", "herramientas", "tool", "tools"
    ):
        return "insumo"
    if k in ("persona", "person", "usuario", "user", "empleado", "empleados"):
        return "persona"
    if k == "insumo":
        return "insumo"
    return None
@csrf_exempt
def recibir_tag(request):
    if request.method != "POST":
        print("Recibiendo tag: método no permitido")
        return JsonResponse({"error": "método no permitido"}, status=405)
    try:
        data = json.loads(request.body or "{}")
    except Exception as e:
        print("Recibiendo tag: json inválido", e)
        return JsonResponse({"error": f"json inválido: {e}"}, status=400)
    print("Recibiendo tag:", data)
    tag = str(data.get("tag", "")).strip()
    if not tag:
        print("Recibiendo tag: tag faltante")
        return JsonResponse({"error": "tag faltante"}, status=400)
    nombre = (data.get("nombre") or "").strip() or None
    categoria = _norm_cat(data.get("categoria"))
    now = timezone.now()
    reg, created = RegistroTag.objects.get_or_create(
        tag=tag,
        defaults={"nombre": nombre, "categoria": categoria, "fecha_hora": now},
    )
    if not created:
        if nombre:
            reg.nombre = nombre
        if categoria:
            reg.categoria = categoria
        reg.fecha_hora = now
        reg.save(update_fields=["nombre", "categoria", "fecha_hora"])
        RegistroTag.objects.filter(tag=tag).exclude(id=reg.id).delete()
    if categoria == "persona":
        respuesta = {"status": "ok", "accion": "persona_actualizada"}
        print("Respuesta:", respuesta)
        return JsonResponse(respuesta)
    if categoria == "insumo":
        asig_activa = Asignacion.objects.filter(item_tag=tag, activo=True).first()
        ventana = now - timezone.timedelta(seconds=20)
        persona_candidata = (
            RegistroTag.objects.filter(
                categoria="persona", created_at__gte=ventana
            )
            .order_by("-created_at")
            .first()
        )
        if not asig_activa:
            if persona_candidata:
                Asignacion.objects.create(
                    persona_tag=persona_candidata.tag,
                    persona_nombre=persona_candidata.nombre,
                    item_tag=tag,
                    item_nombre=reg.nombre,
                    asignado_en=now,
                    activo=True,
                )
                respuesta = {"status": "ok", "accion": "asignacion_creada", "persona_tag": persona_candidata.tag}
                print("Respuesta:", respuesta)
                return JsonResponse(respuesta)
            else:
                respuesta = {"status": "ok", "accion": "sin_persona_candidata"}
                print("Respuesta:", respuesta)
                return JsonResponse(respuesta)
        else:
            asig_activa.activo = False
            asig_activa.devuelto_en = now
            asig_activa.save(update_fields=["activo", "devuelto_en"])
            if persona_candidata and persona_candidata.tag != asig_activa.persona_tag:
                respuesta = {"status": "ok", "accion": "asignacion_cerrada_otro_usuario", "persona_tag": persona_candidata.tag}
                print("Respuesta:", respuesta)
                return JsonResponse(respuesta)
            else:
                respuesta = {"status": "ok", "accion": "asignacion_cerrada"}
                print("Respuesta:", respuesta)
                return JsonResponse(respuesta)
    respuesta = {"status": "ok", "accion": "tag_actualizado"}
    print("Respuesta:", respuesta)
    return JsonResponse(respuesta)
@api_view(["GET"])
def listar_tags(request):
    tags = RegistroTag.objects.all().order_by("-fecha_hora")
    serializer = RegistroTagSerializer(tags, many=True)
    return Response(serializer.data)
@api_view(["GET"])
@permission_classes([AllowAny])
def assignments_list(request):
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
def assignments_devolver(request, id):
    a = Asignacion.objects.filter(pk=id, activo=True).first()
    if not a:
        return Response({"error": "asignación no encontrada o ya devuelta"}, status=404)
    a.activo = False
    a.devuelto_en = timezone.now()
    a.save()
    return Response(AsignacionSerializer(a).data)
@csrf_exempt
def bulk_delete_uncategorized_tags(request):
    """
    Borra masivamente tags sin categoría (solo si categoria es null).
    Recibe lista de tags por POST (JSON).
    """
    if request.method != "POST":
        return JsonResponse({"error": "Método no permitido. Usá POST."}, status=405)
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
    borrados, _ = RegistroTag.objects.filter(tag__in=tags, categoria__isnull=True).delete()
    return JsonResponse({"status": "ok", "borrados": borrados})
@csrf_exempt
def eliminar_tag(request, id):
    """
    Elimina un tag por id. Si hay asignaciones activas, requiere force=1 para forzar.
    """
    if request.method not in ("DELETE", "POST"):
        return JsonResponse({"error": "Método no permitido. Usá DELETE o POST."}, status=405)
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
    tiene_activos = Asignacion.objects.filter(Q(persona_tag=tag_obj.tag) | Q(item_tag=tag_obj.tag), activo=True).exists()
    if tiene_activos and not force:
        return JsonResponse({"error": "No se puede eliminar: hay asignaciones activas. Usá force=1 para forzar."}, status=409)
    tag_obj.delete()
    return JsonResponse({"status": "ok", "borrados": 1})
@api_view(["POST"])
def bulk_delete_uncategorized_tags(request):
    """
    Endpoint para borrar masivamente tags sin categoría.
    Solo borra RegistroTag donde categoria es null y el tag está en la lista.
    """
    try:
        data = request.data if hasattr(request, "data") else json.loads(request.body or "{}")
        tags = data.get("tags", [])
    except Exception as e:
        return Response({"status": "error", "msg": f"json inválido: {e}"}, status=400)
    if not tags:
        return Response({"status": "error", "msg": "Lista de tags vacía."}, status=400)
    borrados = RegistroTag.objects.filter(categoria__isnull=True, tag__in=tags).delete()
    return Response({"status": "ok", "borrados": borrados[0]})

    
    if categoria == "insumo":
        # Buscar asignación activa de este item
        asig_activa = Asignacion.objects.filter(item_tag=tag, activo=True).first()

        # Buscar persona candidata en ventana de 20s
        ventana = now - timezone.timedelta(seconds=20)
        persona_candidata = (
            RegistroTag.objects.filter(
                categoria="persona", fecha_hora__gte=ventana
            )
            .order_by("-fecha_hora")
            .first()
        )

        if not asig_activa:
            # Caso 1: herramienta en pañol, sale con persona
            if persona_candidata:
                Asignacion.objects.create(
                    persona_tag=persona_candidata.tag,
                    persona_nombre=persona_candidata.nombre,
                    item_tag=tag,
                    item_nombre=reg.nombre,
                    asignado_en=now,
                    activo=True,
                )
                return JsonResponse({"status": "ok", "accion": "asignacion_creada", "persona_tag": persona_candidata.tag})
            else:
                # No hay persona candidata, no se crea asignación
                return JsonResponse({"status": "ok", "accion": "sin_persona_candidata"})
        else:
            # Caso 2: herramienta fuera, se devuelve
            asig_activa.activo = False
        {
            "status": "ok",
            "id": tag_obj.id,
            "nombre": tag_obj.nombre,
            "categoria": tag_obj.categoria,
        }



@ensure_csrf_cookie
def csrf_ping(request):
    return JsonResponse({"detail": "ok"})


@require_GET
def listar_tags(request):
    # Solo el registro más reciente por cada tag
    from django.db.models import Max

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


@api_view(["POST"])
@permission_classes([AllowAny])
def assignments_auto(request):

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
            a.save(update_fields=["activo", "devuelto_en"])
            devueltos.append(
                {
                    "id": a.id,
                    "item_tag": item_tag,
                    "item_nombre": item_nombre or a.item_nombre,
                    "devuelto_en": a.devuelto_en,
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
                    "asignado_en": a.asignado_en,
                }
            )

    return Response(
        {
            "status": "ok",
            "persona_tag": persona_tag,
            "persona_nombre": persona_nombre,
            "asignados": asignados,
            "devueltos": devueltos,
            "total_devueltos": len(devueltos),
        },
        status=200,
    )


@csrf_exempt
def bulk_delete_uncategorized_tags(request):

    if request.method != "POST":
        return JsonResponse({"error": "Método no permitido. Usá POST."}, status=405)

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

    from .models import RegistroTag

    borrados, _ = RegistroTag.objects.filter(
        tag__in=tags, categoria__isnull=True
    ).delete()

    return JsonResponse({"status": "ok", "borrados": borrados})


@csrf_exempt
def eliminar_tag(request, id):

    if request.method not in ("DELETE", "POST"):
        return JsonResponse(
            {"error": "Método no permitido. Usá DELETE o POST."}, status=405
        )

    from .models import RegistroTag, Asignacion

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
            {
                "error": "No se puede eliminar: hay asignaciones activas. Usá force=1 para forzar."
            },
            status=409,
        )

    tag_obj.delete()
    return JsonResponse({"status": "ok", "borrados": 1})


@api_view(["GET"])
@permission_classes([AllowAny])
def assignments_list(request):
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
    a = Asignacion.objects.filter(pk=pk, activo=True).first()
    if not a:
        return Response({"error": "asignación no encontrada o ya devuelta"}, status=404)
    a.activo = False
    a.devuelto_en = timezone.now()
    a.save()
    return Response(AsignacionSerializer(a).data)


class PanolViewSet(ModelViewSet):
    queryset = Panol.objects.all().order_by("nombre")
    serializer_class = PanolSerializer
    permission_classes = [AllowAny]


class RegistroTagViewSet(
    mixins.CreateModelMixin, mixins.ListModelMixin, viewsets.GenericViewSet
):
    queryset = RegistroTag.objects.all().order_by("-fecha_hora")
    serializer_class = RegistroTagSerializer
    permission_classes = [AllowAny]

@csrf_exempt
def editar_tag(request, id):
    """
    Edita el nombre y/o la categoría de un tag por id.
    Solo acepta método PUT. Recibe JSON con 'nombre' y/o 'categoria'.
    """
    if request.method != "PUT":
        return JsonResponse({"error": "Método no permitido. Usá PUT."}, status=405)
    tag_obj = get_object_or_404(RegistroTag, pk=id)
    try:
        data = json.loads(request.body or "{}")
    except Exception:
        return JsonResponse({"error": "JSON inválido"}, status=400)
    nombre = (data.get("nombre") or "").strip() or None
    categoria = data.get("categoria")
    if nombre is not None:
        tag_obj.nombre = nombre
    if categoria in ("persona", "insumo", None):
        tag_obj.categoria = categoria
    tag_obj.save(update_fields=[f for f in ["nombre", "categoria"] if getattr(tag_obj, f) is not None])
    return JsonResponse({"status": "ok", "id": tag_obj.id, "nombre": tag_obj.nombre, "categoria": tag_obj.categoria})
