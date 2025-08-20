from django.contrib.auth.models import User
from rest_framework import serializers
import secrets 

class UserCreateSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        # Estos son los campos que se pueden enviar para crear un usuario
        fields = ('username', 'email', 'first_name', 'last_name')

    def create(self, validated_data):
        # Genera una contraseña segura y aleatoria
        password = secrets.token_urlsafe(9) 
        
        # Crea el usuario en la base de datos
        user = User.objects.create_user(
            username=validated_data['username'],
            email=validated_data.get('email', ''), # .get para que sea opcional
            first_name=validated_data.get('first_name', ''),
            last_name=validated_data.get('last_name', ''),
            password=password
        )
        

        print(f"IMPORTANTE: Usuario '{user.username}' creado con la contraseña: {password}")
        
        return user