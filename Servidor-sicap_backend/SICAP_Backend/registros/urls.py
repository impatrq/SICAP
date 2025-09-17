from django.urls import path
from .views import recibir_tag

urlpatterns = [
    path('register/tag/', recibir_tag),
]
