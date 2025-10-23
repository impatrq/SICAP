from django.db import models
from django.utils import timezone

class RegistroTag(models.Model):
    CATEGORIA_AELEGIR = (
        ('persona', 'Persona'),
        ('insumo', 'Insumo'),
    )

    nombre = models.CharField(max_length=100, blank=True, null=True) 
    tag = models.CharField(max_length=100)
    fecha_hora  = models.DateTimeField(default=timezone.now)
    categoria = models.CharField(max_length=20, choices=CATEGORIA_AELEGIR, blank=True, null=True, default=None )

    def __str__(self):
        return f"{self.tag} - {self.fecha_hora}"

class Panol(models.Model):
    nombre = models.CharField(max_length=100)
    icono = models.CharField(max_length=50, default='cube')
    actualizado = models.DateTimeField(auto_now=True)

    def __str__(self):
         return self.nombre

class Asignacion(models.Model):
    persona_tag    = models.CharField(max_length=100)
    persona_nombre = models.CharField(max_length=100, blank=True, null=True)

    item_tag       = models.CharField(max_length=100)
    item_nombre    = models.CharField(max_length=100, blank=True, null=True)

    asignado_en    = models.DateTimeField(default=timezone.now)
    devuelto_en    = models.DateTimeField(blank=True, null=True)
    activo         = models.BooleanField(default=True)

    def __str__(self):
        estado = "activo" if self.activo else "devuelto"
        return f"{self.persona_tag} <- {self.item_tag} ({estado})"
