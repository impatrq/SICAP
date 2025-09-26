from django.db import models

class RegistroTag(models.Model):
    tag = models.CharField(max_length=100)
    fecha_horaen  = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.tag} - {self.fecha_hora}"

class Panol(models.Model):
    nombre = models.CharField(max_length=100)
    icono = models.CharField(max_length=50, default='cube')

    def __str__(self):
         return self.nombre
