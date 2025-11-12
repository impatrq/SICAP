"""
Modelos del módulo `usuarios_login`.

Modelos ligeros para administrar programadores y pañoles vinculados
al usuario de Django.
"""

from django.db import models
from django.contrib.auth.models import User


class Programmer(models.Model):
    fullname = models.CharField(max_length=100)


class Pañol(models.Model):
    nombre = models.CharField(max_length=100)

    usuario = models.ForeignKey(User, on_delete=models.CASCADE, related_name="pañoles")

    def __str__(self):
        return self.nombre
