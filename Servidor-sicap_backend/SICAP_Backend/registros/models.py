"""
Modelos usados por el módulo `registros`.

Modelos principales:
- RegistroTag: una lectura de tag con nombre, categoría y timestamp.
- Panol: entidad sencilla que representa un contenedor/almacén.
- Asignacion: registro que vincula una persona con un item y su estado.
- PersonaSesion: modelo temporal para controlar sesiones de persona
    (aperturas/cierres) durante una operación de escaneo.

Se incluyen índices en campos consultados frecuentemente para mejorar
el rendimiento de las consultas.
"""

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



class PersonaSesion(models.Model):
    persona_tag = models.CharField(max_length=100, db_index=True)
    nombre = models.CharField(max_length=100, blank=True, null=True)
    inicio = models.DateTimeField(default=timezone.now)
    fin = models.DateTimeField(null=True, blank=True)
    activa = models.BooleanField(default=True)

    def __str__(self):
        estado = "activa" if self.activa else f"cerrada {self.fin:%Y-%m-%d %H:%M:%S}" if self.fin else "inactiva"
        return f"Sesion {self.persona_tag} ({estado})"

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


