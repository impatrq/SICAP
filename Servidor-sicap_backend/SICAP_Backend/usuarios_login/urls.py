from django.urls import path, include
from rest_framework.routers import DefaultRouter
from . import views

router = DefaultRouter()
router.register(r'programmers', views.ProgrammerViewSet, basename='programmer')

urlpatterns = [
    
    path('', include(router.urls)),

    
    path('login/', views.login_view, name='login'),

    
    path('admin/create-user/', views.UserCreateAPIView.as_view(), name='create-user'),
]