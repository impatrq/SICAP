from django.db import models
from django.utils import timezone

class RegistroTag(models.Model):
    nombre = models.CharField(max_length=100, blank=True, null=True) 
    tag = models.CharField(max_length=100)
    fecha_hora  = models.DateTimeField(default=timezone.now)
    

    def __str__(self):
        return f"{self.tag} - {self.fecha_hora}"

class Panol(models.Model):
    nombre = models.CharField(max_length=100)
    icono = models.CharField(max_length=50, default='cube')

    def __str__(self):
         return self.nombre
