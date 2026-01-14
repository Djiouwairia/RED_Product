from rest_framework import serializers
from messaging.models import Message
from accounts.models import User


class UserMinimalSerializer(serializers.ModelSerializer):
    """Serializer minimal pour les utilisateurs dans les messages"""
    class Meta:
        model = User
        fields = ['id', 'username', 'email', 'first_name', 'last_name']


class MessageSerializer(serializers.ModelSerializer):
    """Serializer complet pour les messages"""
    expediteur = UserMinimalSerializer(read_only=True)
    destinataire = UserMinimalSerializer(read_only=True)
    destinataire_id = serializers.IntegerField(write_only=True)
    
    class Meta:
        model = Message
        fields = [
            'id', 
            'expediteur', 
            'destinataire',
            'destinataire_id',
            'sujet', 
            'contenu', 
            'status', 
            'date_envoi', 
            'date_lecture'
        ]
        read_only_fields = ['id', 'expediteur', 'status', 'date_envoi', 'date_lecture']
    
    def validate_destinataire_id(self, value):
        """Vérifier que le destinataire existe"""
        try:
            User.objects.get(id=value)
        except User.DoesNotExist:
            raise serializers.ValidationError("Ce destinataire n'existe pas")
        return value
    
    def create(self, validated_data):
        """Créer un message"""
        destinataire_id = validated_data.pop('destinataire_id')
        destinataire = User.objects.get(id=destinataire_id)
        
        message = Message.objects.create(
            destinataire=destinataire,
            **validated_data
        )
        return message


class MessageListSerializer(serializers.ModelSerializer):
    """Serializer simplifié pour la liste des messages"""
    expediteur_nom = serializers.CharField(source='expediteur.username', read_only=True)
    destinataire_nom = serializers.CharField(source='destinataire.username', read_only=True)
    est_lu = serializers.SerializerMethodField()
    
    class Meta:
        model = Message
        fields = [
            'id', 
            'expediteur_nom',
            'destinataire_nom',
            'sujet', 
            'status',
            'est_lu',
            'date_envoi'
        ]
    
    def get_est_lu(self, obj):
        return obj.status == 'read'