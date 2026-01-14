from rest_framework import viewsets, status, permissions
from rest_framework.decorators import action
from rest_framework.response import Response
from django.db.models import Q
from messaging.models import Message
from messaging.serializers import MessageSerializer, MessageListSerializer


class MessageViewSet(viewsets.ModelViewSet):
    """
    ViewSet pour gérer les messages
    
    list: Retourner tous les messages (reçus et envoyés)
    retrieve: Retourner les détails d'un message
    create: Créer un nouveau message
    destroy: Supprimer un message
    """
    serializer_class = MessageSerializer
    permission_classes = [permissions.IsAuthenticated]
    
    def get_queryset(self):
        """Retourner les messages de l'utilisateur connecté"""
        user = self.request.user
        
        # Filtrer selon le paramètre 'type'
        message_type = self.request.query_params.get('type', 'all')
        
        if message_type == 'received':
            # Messages reçus uniquement
            return Message.objects.filter(destinataire=user)
        elif message_type == 'sent':
            # Messages envoyés uniquement
            return Message.objects.filter(expediteur=user)
        else:
            # Tous les messages (reçus et envoyés)
            return Message.objects.filter(
                Q(expediteur=user) | Q(destinataire=user)
            ).distinct()
    
    def get_serializer_class(self):
        """Utiliser un serializer simplifié pour la liste"""
        if self.action == 'list':
            return MessageListSerializer
        return MessageSerializer
    
    def perform_create(self, serializer):
        """Associer l'expéditeur lors de la création"""
        serializer.save(expediteur=self.request.user)
    
    def retrieve(self, request, *args, **kwargs):
        """Marquer le message comme lu lors de la consultation"""
        instance = self.get_object()
        
        # Marquer comme lu si l'utilisateur est le destinataire
        if instance.destinataire == request.user and instance.status == 'sent':
            instance.marquer_comme_lu()
        
        serializer = self.get_serializer(instance)
        return Response(serializer.data)
    
    @action(detail=False, methods=['get'])
    def non_lus(self, request):
        """Retourner uniquement les messages non lus"""
        messages = Message.objects.filter(
            destinataire=request.user,
            status='sent'
        )
        serializer = self.get_serializer(messages, many=True)
        return Response(serializer.data)
    
    @action(detail=False, methods=['get'])
    def statistiques(self, request):
        """Retourner les statistiques des messages"""
        user = request.user
        
        stats = {
            'total_recus': Message.objects.filter(destinataire=user).count(),
            'total_envoyes': Message.objects.filter(expediteur=user).count(),
            'non_lus': Message.objects.filter(destinataire=user, status='sent').count(),
            'archives': Message.objects.filter(
                Q(expediteur=user) | Q(destinataire=user),
                status='archived'
            ).count(),
        }
        
        return Response(stats)
    
    @action(detail=True, methods=['post'])
    def marquer_lu(self, request, pk=None):
        """Marquer un message comme lu"""
        message = self.get_object()
        
        if message.destinataire != request.user:
            return Response(
                {'error': 'Vous ne pouvez pas marquer ce message comme lu'},
                status=status.HTTP_403_FORBIDDEN
            )
        
        message.marquer_comme_lu()
        serializer = self.get_serializer(message)
        return Response(serializer.data)
    
    @action(detail=True, methods=['post'])
    def archiver(self, request, pk=None):
        """Archiver un message"""
        message = self.get_object()
        
        # Seul l'expéditeur ou le destinataire peut archiver
        if message.expediteur != request.user and message.destinataire != request.user:
            return Response(
                {'error': 'Vous ne pouvez pas archiver ce message'},
                status=status.HTTP_403_FORBIDDEN
            )
        
        message.status = 'archived'
        message.save()
        
        serializer = self.get_serializer(message)
        return Response(serializer.data)