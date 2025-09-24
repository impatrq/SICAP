from rest_framework import serializers
from rest_framework.viewsets import ModelViewSet
from rest_framework.permissions import IsAuthenticatedOrReadOnly
from .models import Panol 

class PanolSerializer(serializers.ModelSerializer):
    class Meta:
        model = Panol
        fields = ['id', 'nombre', 'icono']

class PanolViewSet(ModelViewSet):
    queryset = Panol.objects.all().order_by('nombre')
    serializer_class = PanolSerializer
    permission_classes = [IsAuthenticatedOrReadOnly]