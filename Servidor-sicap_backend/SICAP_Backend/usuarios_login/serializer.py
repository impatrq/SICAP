from django.contrib.auth.models import User
from rest_framework import serializers
from .models import Programmer
import secrets 

class ProgrammerSerializer(serializers.ModelSerializer):
    class Meta:
        model = Programmer
        
        fields = ('id', 'fullname')


class UserCreateSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        
        fields = ('username','first_name')

    def create(self, validated_data):
        
        password = secrets.token_urlsafe(9) 
        
        
        user = User.objects.create_user(
            username=validated_data['username'],
            first_name=validated_data.get('first_name', ''),
            password=password
        )
        

        print(f"IMPORTANTE: Usuario '{user.username}' creado con la contraseña: {password}")
        
        return user