from django.urls import path, include
from rest_framework.routers import DefaultRouter
from rest_framework import routers
from .views import RegistroViewSet


from .views import recibir_tag, listar_tags, PanolViewSet, csrf_ping, RegistroViewSet

router = DefaultRouter()
router.register(r'panoles', PanolViewSet, basename='panoles')
router.register(r'register/tag/', RegistroViewSet, basename='register-tag')

urlpatterns = [
    path('auth/csrf/', csrf_ping),
    path('', include (router.urls)),
    path('register/tag/<int:id>', recibir_tag),
    #  path('register/tag/', recibir_tag),
    path('register/tag/list/', listar_tags),  
]
