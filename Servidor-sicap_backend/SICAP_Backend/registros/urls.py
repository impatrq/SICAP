from django.urls import path
from .views import recibir_tag

urlpatterns = [
    
    path('recibir/', recibir_tag),
]