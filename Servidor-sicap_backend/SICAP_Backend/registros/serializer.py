from rest_framework import serializers
from rest_framework.viewsets import ModelViewSet
from rest_framework.permissions import IsAuthenticatedOrReadOnly
from .models import Panol, RegistroTag 

class PanolSerializer(serializers.ModelSerializer):
    class Meta:
        model = Panol
        fields = ['id', 'nombre', 'icono']

class RegistroTagSerializer(serializers.ModelSerializer):
    class Meta:
        model = RegistroTag
        fields = ['nombre','id', 'tag', 'fecha_hora', 'created_at']
