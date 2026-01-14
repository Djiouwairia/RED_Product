from rest_framework import viewsets, permissions, status, filters
from rest_framework.decorators import action
from rest_framework.response import Response
from django_filters.rest_framework import DjangoFilterBackend
from hotels.models import Hotel
from hotels.serializers import HotelSerializer, HotelListSerializer
from django.db import models # Ajoute cette ligne


class IsAdminOrReadOnly(permissions.BasePermission):
    def has_permission(self, request, view):
        if request.method in permissions.SAFE_METHODS:
            return request.user and request.user.is_authenticated
        
        # Correction ici : utilise is_superuser ou is_staff
        return request.user and request.user.is_authenticated and request.user.is_superuser
    
    def has_object_permission(self, request, view, obj):
        if request.method in permissions.SAFE_METHODS:
            return True
        # Correction ici aussi
        return request.user.is_superuser


class HotelViewSet(viewsets.ModelViewSet):
    """
    ViewSet pour gérer les opérations CRUD sur les hôtels
    
    list: Retourner la liste de tous les hôtels
    retrieve: Retourner les détails d'un hôtel
    create: Créer un nouvel hôtel (admin uniquement)
    update: Modifier un hôtel (admin uniquement)
    partial_update: Modifier partiellement un hôtel (admin uniquement)
    destroy: Supprimer un hôtel (admin uniquement)
    """
    queryset = Hotel.objects.all().select_related('created_by')
    serializer_class = HotelSerializer
    permission_classes = [IsAdminOrReadOnly]
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