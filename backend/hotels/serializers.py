from rest_framework import serializers
from hotels.models import Hotel
from accounts.models import User


class UserSerializer(serializers.ModelSerializer):
    """Serializer pour l'utilisateur créateur"""
    class Meta:
        model = User
        fields = ['id', 'email', 'username', 'first_name', 'last_name']


class HotelSerializer(serializers.ModelSerializer):
    """Serializer pour les hôtels"""
    created_by = UserSerializer(read_only=True)
    
    class Meta:
        model = Hotel
        fields = [
            'id', 
            'nom', 
            'adresse', 
            'email', 
            'telephone', 
            'prix_par_nuit', 
            'devise', 
            'image', 
            'created_by', 
            'created_at', 
            'updated_at'
        ]
        read_only_fields = ['id', 'created_by', 'created_at', 'updated_at']
    
    def validate_prix_par_nuit(self, value):
        """Valider que le prix est positif"""
        if value <= 0:
            raise serializers.ValidationError("Le prix doit être supérieur à 0")
        return value
    
    def validate_telephone(self, value):
        """Valider le format du téléphone"""
        if not value.replace('+', '').replace(' ', '').isdigit():
            raise serializers.ValidationError("Le numéro de téléphone doit contenir uniquement des chiffres")
        return value


class HotelListSerializer(serializers.ModelSerializer):
    """Serializer simplifié pour la liste des hôtels"""
    class Meta:
        model = Hotel
        fields = ['id', 'nom', 'adresse', 'prix_par_nuit', 'devise', 'image']