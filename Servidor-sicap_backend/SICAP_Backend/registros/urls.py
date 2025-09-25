from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import recibir_tag, listar_tags, PanolViewSet
from rest_framework import routers
from .views import RegistroViewSet


router = DefaultRouter()
router.register(r'panoles', PanolViewSet, basename='panoles')
router.register(r'register/tag', RegistroViewSet, basename='register-tag')

urlpatterns = [
    path('', include (router.urls)),
    path('register/tag/', recibir_tag),
    path('register/tag/list/', listar_tags),  
]
