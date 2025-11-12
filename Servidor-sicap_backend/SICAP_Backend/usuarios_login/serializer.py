"""
Serializadores del módulo `usuarios_login`.

Incluye: ProgrammerSerializer, UserCreateSerializer (genera password
aleatorio) y PañolSerializer.
"""

from django.contrib.auth.models import User
from rest_framework import serializers
import secrets
from .models import Programmer
from .models import Pañol


class ProgrammerSerializer(serializers.ModelSerializer):
    class Meta:
        model = Programmer
        fields = ("id", "fullname")


class UserCreateSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ("username", "first_name", "last_name")

    def create(self, validated_data):

        password = secrets.token_urlsafe(9)

        user = User.objects.create_user(
            username=validated_data["username"],
            first_name=validated_data.get("first_name", ""),
            last_name=validated_data.get("last_name", ""),
            password=password,
        )

        print(
            f"IMPORTANTE: Usuario '{user.username}' creado con la contraseña: {password}"
        )

        return user


class PañolSerializer(serializers.ModelSerializer):
    class Meta:
        model = Pañol
        fields = ("id", "nombre")
