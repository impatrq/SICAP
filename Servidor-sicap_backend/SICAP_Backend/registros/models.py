from django.db import models
from django.utils import timezone


class RegistroTag(models.Model):
    CATEGORIA_AELEGIR = (
        ("persona", "Persona"),
        ("insumo", "Insumo"),
    )

    nombre = models.CharField(max_length=100, blank=True, null=True)
    tag = models.CharField(max_length=100, unique=True)
    fecha_hora = models.DateTimeField(default=timezone.now)
    categoria = models.CharField(
        max_length=20, choices=CATEGORIA_AELEGIR, blank=True, null=True, default=None
    )

    def __str__(self):
        return f"{self.tag} - {self.fecha_hora}"


class Panol(models.Model):
    nombre = models.CharField(max_length=100)
    icono = models.CharField(max_length=50, default="cube")

    def __str__(self):
        return self.nombre


class Asignacion(models.Model):
    persona_tag = models.CharField(max_length=64, db_index=True)
    persona_nombre = models.CharField(max_length=128, null=True, blank=True)

    item_tag = models.CharField(max_length=64, db_index=True)
    item_nombre = models.CharField(max_length=128, null=True, blank=True)

    asignado_en = models.DateTimeField(default=timezone.now)
    devuelto_en = models.DateTimeField(null=True, blank=True)
    activo = models.BooleanField(default=True)

    class Meta:
        indexes = [
            models.Index(fields=["persona_tag", "activo"]),
            models.Index(fields=["item_tag", "activo"]),
            models.Index(fields=["asignado_en"]),
        ]

    def __str__(self):
        estado = (
            "activo"
            if self.activo
            else (
                f"devuelto {self.devuelto_en:%Y-%m-%d %H:%M:%S}"
                if self.devuelto_en
                else "inactivo"
            )
        )
        return f"{self.persona_tag} ← {self.item_tag} ({estado})"


class PersonaSesion(models.Model):
    persona_tag = models.CharField(max_length=64, db_index=True)
    persona_nombre = models.CharField(max_length=128, null=True, blank=True)
    opened_at = models.DateTimeField(default=timezone.now)
    closed_at = models.DateTimeField(null=True, blank=True)
    activo = models.BooleanField(default=True)

    class Meta:
        indexes = [
            models.Index(fields=["persona_tag", "activo"]),
            models.Index(fields=["opened_at"]),
        ]

    def __str__(self):
        estado = "abierta" if self.activo else "cerrada"
        return f"{self.persona_tag} ({estado}) {self.opened_at:%Y-%m-%d %H:%M:%S}"
