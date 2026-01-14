from django.urls import path, include
from rest_framework.routers import DefaultRouter
from messaging.views import MessageViewSet

app_name = 'messaging'

router = DefaultRouter()
router.register(r'', MessageViewSet, basename='message')

urlpatterns = [
    path('', include(router.urls)),
]

# Routes générées automatiquement:
# GET    /api/messages/                    - Liste des messages
# POST   /api/messages/                    - Envoyer un message
# GET    /api/messages/{id}/               - Détails d'un message
# DELETE /api/messages/{id}/               - Supprimer un message
# GET    /api/messages/non_lus/            - Messages non lus
# GET    /api/messages/statistiques/       - Statistiques des messages
# POST   /api/messages/{id}/marquer_lu/    - Marquer comme lu
# POST   /api/messages/{id}/archiver/      - Archiver un message