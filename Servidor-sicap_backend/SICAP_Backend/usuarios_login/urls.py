from django.urls import path, include
from rest_framework import routers
from usuarios_login import views

router= routers.DefaultRouter()
router.register(r'programmers', views.ProgrammerViewSet)

urlpatterns = [
    path('', include(router.urls)),  # Incluye las rutas del router 
]