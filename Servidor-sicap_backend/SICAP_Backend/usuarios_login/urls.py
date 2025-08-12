from django.urls import path, include
from rest_framework import routers
from . import views # Es una buena práctica importar todo el módulo de vistas

router = routers.DefaultRouter()
router.register(r'programmers', views.ProgrammerViewSet)

urlpatterns = [
    path('', include(router.urls)),
    path('api/authenticate', views.authenticate, name='authenticate'),
    path('login/', views.login_view, name='login'),
    
path('api/admin/create-user/', views.UserCreateAPIView.as_view(), name='create-user'),
]