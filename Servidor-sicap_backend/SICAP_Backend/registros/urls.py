from django.urls import path
from .views import recibir_tag, listar_tags

urlpatterns = [
    path('register/tag/', recibir_tag),
    path('register/tag/list/', listar_tags),  
]
