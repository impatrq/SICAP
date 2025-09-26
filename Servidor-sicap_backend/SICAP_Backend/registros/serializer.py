from rest_framework import serializers
from rest_framework.viewsets import ModelViewSet
from rest_framework.permissions import IsAuthenticatedOrReadOnly
from .models import Panol, RegistroTag 

class PanolSerializer(serializers.ModelSerializer):
    class Meta:
        model = Panol
        fields = ['id', 'nombre', 'icono']

class RegistroSerializer(serializers.ModelSerializer):
    class Meta:
        model = RegistroTag
        fields = ['id', 'tag', 'fecha_hora']
