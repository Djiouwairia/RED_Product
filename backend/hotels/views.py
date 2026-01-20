from rest_framework import viewsets, permissions, status, filters
from rest_framework.decorators import action
from rest_framework.response import Response
from django_filters.rest_framework import DjangoFilterBackend
from hotels.models import Hotel
from hotels.serializers import HotelSerializer, HotelListSerializer
from django.db import models


class IsAuthenticatedOrAdmin(permissions.BasePermission):
    """
    Permission personnalisée:
    - Lecture: Tous les utilisateurs authentifiés
    - Création/Modification/Suppression: Admins uniquement (is_admin=True)
    """
    def has_permission(self, request, view):
        # Lecture autorisée pour tous les utilisateurs authentifiés
        if request.method in permissions.SAFE_METHODS:
            return request.user and request.user.is_authenticated
        
        # Création/modification/suppression uniquement pour les admins
        # Utiliser is_admin au lieu de is_superuser
        return request.user and request.user.is_authenticated and (
            request.user.is_admin or request.user.is_superuser or request.user.is_staff
        )
    
    def has_object_permission(self, request, view, obj):
        # Lecture autorisée pour tous
        if request.method in permissions.SAFE_METHODS:
            return True
        # Modification/suppression uniquement pour les admins
        return request.user.is_admin or request.user.is_superuser or request.user.is_staff


class HotelViewSet(viewsets.ModelViewSet):
    """
    ViewSet pour gérer les opérations CRUD sur les hôtels
    """
    queryset = Hotel.objects.all().select_related('created_by')
    serializer_class = HotelSerializer
    permission_classes = [IsAuthenticatedOrAdmin]
    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    search_fields = ['nom', 'adresse', 'email']
    ordering_fields = ['nom', 'prix_par_nuit', 'created_at']
    ordering = ['-created_at']
    
    def get_serializer_class(self):
        """Utiliser un serializer simplifié pour la liste"""
        if self.action == 'list':
            return HotelListSerializer
        return HotelSerializer
    
    def perform_create(self, serializer):
        """Associer l'utilisateur connecté lors de la création"""
        serializer.save(created_by=self.request.user)
    
    def get_queryset(self):
        """Filtrer les hôtels selon les paramètres de recherche"""
        queryset = Hotel.objects.all().select_related('created_by')
        
        # Recherche par nom
        search = self.request.query_params.get('search', None)
        if search:
            queryset = queryset.filter(nom__icontains=search)
        
        # Filtre par devise
        devise = self.request.query_params.get('devise', None)
        if devise:
            queryset = queryset.filter(devise=devise)
        
        # Filtre par prix min/max
        prix_min = self.request.query_params.get('prix_min', None)
        if prix_min:
            queryset = queryset.filter(prix_par_nuit__gte=prix_min)
        
        prix_max = self.request.query_params.get('prix_max', None)
        if prix_max:
            queryset = queryset.filter(prix_par_nuit__lte=prix_max)
        
        return queryset
    
    @action(detail=False, methods=['get'])
    def mes_hotels(self, request):
        """Retourner uniquement les hôtels créés par l'utilisateur connecté"""
        hotels = self.get_queryset().filter(created_by=request.user)
        serializer = self.get_serializer(hotels, many=True)
        return Response(serializer.data)
    
    @action(detail=False, methods=['get'])
    def statistiques(self, request):
        """Retourner des statistiques sur les hôtels"""
        queryset = self.get_queryset()
        
        stats = {
            'total_hotels': queryset.count(),
            'hotels_par_devise': {
                'XOF': queryset.filter(devise='XOF').count(),
                'EUR': queryset.filter(devise='EUR').count(),
                'USD': queryset.filter(devise='USD').count(),
            },
            'prix_moyen': queryset.aggregate(
                avg_prix=models.Avg('prix_par_nuit')
            )['avg_prix'],
        }
        
        return Response(stats)
    
    def destroy(self, request, *args, **kwargs):
        """Supprimer un hôtel avec message de confirmation"""
        instance = self.get_object()
        self.perform_destroy(instance)
        return Response(
            {"message": "Hôtel supprimé avec succès"},
            status=status.HTTP_204_NO_CONTENT
        )