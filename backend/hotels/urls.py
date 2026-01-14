from django.urls import path, include
from rest_framework.routers import DefaultRouter
from hotels.views import HotelViewSet

app_name = 'hotels'

# Router pour les ViewSets
router = DefaultRouter()
router.register(r'', HotelViewSet, basename='hotel')

urlpatterns = [
    path('', include(router.urls)),
]

# Les routes générées automatiquement sont:
# GET    /api/hotels/                 - Liste de tous les hôtels
# POST   /api/hotels/                 - Créer un nouvel hôtel (admin)
# GET    /api/hotels/{id}/            - Détails d'un hôtel
# PUT    /api/hotels/{id}/            - Modifier un hôtel (admin)
# PATCH  /api/hotels/{id}/            - Modifier partiellement (admin)
# DELETE /api/hotels/{id}/            - Supprimer un hôtel (admin)
# GET    /api/hotels/mes_hotels/      - Mes hôtels
# GET    /api/hotels/statistiques/    - Statistiques