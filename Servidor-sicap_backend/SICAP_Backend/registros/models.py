from django.db import models

class RegistroTag(models.Model):
    tag_id = models.CharField(max_length=100)
    fecha_hora = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.tag_id} - {self.fecha_hora}"
