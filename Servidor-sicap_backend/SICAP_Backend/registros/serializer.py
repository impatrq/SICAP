from rest_framework import serializers
from .models import Panol  # y agrega otros modelos si los usás (p.ej. RegistroTag, TagPerfil)

class PanolSerializer(serializers.ModelSerializer):
    class Meta:
        model = Panol
        fields = ['id', 'nombre', 'icono']
