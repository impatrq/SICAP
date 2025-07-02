from django.urls import path
from .views import recibir_tag

urlpatterns = [
    path('api/recibir/', recibir_tag),
]
