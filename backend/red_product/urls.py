from django.contrib import admin
from django.urls import path, include
from django.conf import settings
from django.conf.urls.static import static
from rest_framework import permissions
from drf_yasg.views import get_schema_view
from drf_yasg import openapi

# Configuration de la documentation API (Swagger)
schema_view = get_schema_view(
    openapi.Info(
        title="RED Product API",
        default_version='v1',
        description="API de gestion d'hôtels - RED Product",
        terms_of_service="https://www.google.com/policies/terms/",
        contact=openapi.Contact(email="contact@redproduct.com"),
        license=openapi.License(name="BSD License"),
    ),
    public=True,
    permission_classes=[permissions.AllowAny],
)

urlpatterns = [
    # Admin Django
    path('admin/', admin.site.urls),
    
    # API endpoints
    path('api/auth/', include('accounts.urls')),
    path('api/hotels/', include('hotels.urls')),
    path('api/messages/', include('messaging.urls')),
    
    # Documentation API (optionnel - installer drf-yasg)
    # path('swagger/', schema_view.with_ui('swagger', cache_timeout=0), name='schema-swagger-ui'),
    # path('redoc/', schema_view.with_ui('redoc', cache_timeout=0), name='schema-redoc'),
]

# Configuration pour servir les fichiers media en développement
if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
    urlpatterns += static(settings.STATIC_URL, document_root=settings.STATIC_ROOT)

# Configuration du site admin
admin.site.site_header = "RED Product Administration"
admin.site.site_title = "RED Product Admin"
admin.site.index_title = "Bienvenue sur RED Product"