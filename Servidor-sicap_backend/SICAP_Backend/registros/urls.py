from django.urls import path, include
from rest_framework.routers import DefaultRouter
from rest_framework import routers
from .views import recibir_tag, listar_tags, PanolViewSet, csrf_ping, RegistroTagViewSet, editar_tag, assignments_list, assignments_auto, assignments_devolver, bulk_delete_uncategorized_tags, eliminar_tag

router = DefaultRouter()
router.register(r'panoles', PanolViewSet, basename='panoles')
router.register(r'tags', RegistroTagViewSet, basename='register-tag')

urlpatterns = [
    path('auth/csrf/', csrf_ping,name='csrf-ping'),
    path('', include (router.urls)),
    path('register/tag/', recibir_tag, name= "recibir-tag"),
    path('register/tag/list/', listar_tags, name="listar-tags"),  
		path('register/tag/<int:id>/eliminar/', eliminar_tag, name='registrotag-eliminar'),
    path('register/tag/<int:id>/editar/', editar_tag, name="editar-tag"),
    path('register/tag/bulk_delete/', bulk_delete_uncategorized_tags, name='registrotag-bulk-delete'),
    path('assignments/', assignments_list, name='assignments_list'),
    path('assignments/auto/', assignments_auto, name='assignments_auto'),
    path('assignments/<int:pk>/devolver/', assignments_devolver, name='assignments_devolver'),
]

urlpatterns += router.urls
