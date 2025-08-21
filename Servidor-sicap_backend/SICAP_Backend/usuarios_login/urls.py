from django.urls import path
from . import views

urlpatterns = [
    
    path('login/', views.login_view, name='login'),
    
    path('crear-usuario/', views.UserCreateAPIView.as_view(), name='create-user'),
    
    path('mis-pañoles/', views.MisPañolesAPIView.as_view(), name='mis-pañoles'),
]