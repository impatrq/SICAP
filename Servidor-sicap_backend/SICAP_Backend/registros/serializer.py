from rest_framework import serializers
from rest_framework.viewsets import ModelViewSet
from rest_framework.permissions import IsAuthenticatedOrReadOnly
from .models import Panol, RegistroTag 

class PanolSerializer(serializers.ModelSerializer):
    class Meta:
        model = Panol
        fields = ['id', 'nombre', 'icono']

class RegistroTagSerializer(serializers.ModelSerializer):
    categoria = serializers.ChoiceField(choices=['persona','insumo'], allow_null = True, required = False)
    class Meta:
        model = RegistroTag
        fields = ['nombre','categoria','id', 'tag', 'fecha_hora', 'created_at']

class AsignacionSerializer(serializers.ModelSerializer):
    class Meta:
        model = Asignacion
        fields = [
            'id', 'persona_tag', 'persona_nombre',
            'item_tag', 'item_nombre',
            'asignado_en', 'devuelto_en', 'activo'
        ]
