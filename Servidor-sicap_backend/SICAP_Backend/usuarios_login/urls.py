from django.urls import path, include
from rest_framework import routers
from . import views

router = routers.DefaultRouter()
router.register(r'programmers', views.ProgrammerViewSet)

urlpatterns = [
    
    path('', include(router.urls)),
    
    
    path('authenticate/', views.authenticate, name='authenticate'),
    path('login/', views.login_view, name='login'),
    path('admin/create-user/', views.UserCreateAPIView.as_view(), name='create-user'),
]