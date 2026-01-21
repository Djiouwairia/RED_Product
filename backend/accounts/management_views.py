from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny
from rest_framework.response import Response
from rest_framework import status
from django.contrib.auth import get_user_model
from django.conf import settings
import os

User = get_user_model()

@api_view(['POST'])
@permission_classes([AllowAny])
def create_initial_superuser(request):
    """
    Endpoint pour créer le superutilisateur initial.
    À UTILISER UNE SEULE FOIS puis à supprimer pour la sécurité.
    """
    # Clé secrète pour sécuriser cet endpoint
    secret_key = request.data.get('secret_key')
    
    # Utiliser une variable d'environnement comme clé
    if secret_key != os.environ.get('SETUP_SECRET_KEY', 'CHANGE_ME_IN_PRODUCTION'):
        return Response({
            'error': 'Clé secrète invalide'
        }, status=status.HTTP_403_FORBIDDEN)
    
    # Vérifier si un superutilisateur existe déjà
    if User.objects.filter(is_superuser=True).exists():
        return Response({
            'message': 'Un superutilisateur existe déjà',
            'email': User.objects.filter(is_superuser=True).first().email
        }, status=status.HTTP_400_BAD_REQUEST)
    
    # Récupérer les données du superutilisateur
    email = request.data.get('email', 'admin@redproduct.com')
    username = request.data.get('username', 'admin')
    password = request.data.get('password', 'AdminRed2026!')
    first_name = request.data.get('first_name', 'Admin')
    last_name = request.data.get('last_name', 'RED Product')
    
    try:
        # Créer le superutilisateur
        user = User.objects.create_superuser(
            email=email,
            username=username,
            password=password,
            first_name=first_name,
            last_name=last_name
        )
        user.is_admin = True
        user.save()
        
        return Response({
            'success': True,
            'message': 'Superutilisateur créé avec succès',
            'user': {
                'id': user.id,
                'email': user.email,
                'username': user.username,
                'first_name': user.first_name,
                'last_name': user.last_name,
            }
        }, status=status.HTTP_201_CREATED)
        
    except Exception as e:
        return Response({
            'error': str(e)
        }, status=status.HTTP_400_BAD_REQUEST)


@api_view(['POST'])
@permission_classes([AllowAny])
def create_test_data(request):
    """
    Endpoint pour créer des données de test.
    À utiliser après la création du superutilisateur.
    """
    secret_key = request.data.get('secret_key')
    
    if secret_key != os.environ.get('SETUP_SECRET_KEY', 'CHANGE_ME_IN_PRODUCTION'):
        return Response({
            'error': 'Clé secrète invalide'
        }, status=status.HTTP_403_FORBIDDEN)
    
    from hotels.models import Hotel
    from messaging.models import Message
    
    try:
        # Récupérer l'admin
        admin = User.objects.filter(is_superuser=True).first()
        if not admin:
            return Response({
                'error': 'Aucun superutilisateur trouvé. Créez-en un d\'abord.'
            }, status=status.HTTP_400_BAD_REQUEST)
        
        # Créer un utilisateur de test
        if not User.objects.filter(email='user@test.com').exists():
            user_test = User.objects.create_user(
                email='user@test.com',
                username='testuser',
                first_name='Test',
                last_name='User',
                password='TestPass123!'
            )
        else:
            user_test = User.objects.get(email='user@test.com')
        
        # Créer des hôtels de test
        hotels_created = []
        
        hotels_data = [
            {
                'nom': 'Hôtel du Lac',
                'adresse': '123 Avenue du Lac, Dakar',
                'email': 'contact@hoteldulac.sn',
                'telephone': '+221771234567',
                'prix_par_nuit': 45000,
                'devise': 'XOF'
            },
            {
                'nom': 'Royal Suites',
                'adresse': '456 Boulevard de la République, Dakar',
                'email': 'info@royalsuites.sn',
                'telephone': '+221772345678',
                'prix_par_nuit': 75000,
                'devise': 'XOF'
            },
            {
                'nom': 'Ocean View Resort',
                'adresse': '789 Corniche Ouest, Dakar',
                'email': 'reservations@oceanview.sn',
                'telephone': '+221773456789',
                'prix_par_nuit': 120000,
                'devise': 'XOF'
            },
            {
                'nom': 'Sunset Paradise',
                'adresse': '321 Route de Ngor, Dakar',
                'email': 'info@sunsetparadise.sn',
                'telephone': '+221774567890',
                'prix_par_nuit': 95000,
                'devise': 'XOF'
            },
            {
                'nom': 'Le Grand Hotel',
                'adresse': '555 Place de l\'Indépendance, Dakar',
                'email': 'contact@legrandhotel.sn',
                'telephone': '+221775678901',
                'prix_par_nuit': 150000,
                'devise': 'XOF'
            }
        ]
        
        for hotel_data in hotels_data:
            if not Hotel.objects.filter(email=hotel_data['email']).exists():
                hotel = Hotel.objects.create(
                    created_by=admin,
                    **hotel_data
                )
                hotels_created.append(hotel.nom)
        
        # Créer un message de test
        if not Message.objects.filter(expediteur=admin, destinataire=user_test).exists():
            Message.objects.create(
                expediteur=admin,
                destinataire=user_test,
                sujet='Bienvenue sur RED Product',
                contenu='Bienvenue sur la plateforme RED Product ! N\'hésitez pas à explorer toutes les fonctionnalités.'
            )
        
        return Response({
            'success': True,
            'message': 'Données de test créées avec succès',
            'stats': {
                'total_users': User.objects.count(),
                'total_hotels': Hotel.objects.count(),
                'total_messages': Message.objects.count(),
                'hotels_created': hotels_created
            }
        }, status=status.HTTP_201_CREATED)
        
    except Exception as e:
        return Response({
            'error': str(e)
        }, status=status.HTTP_400_BAD_REQUEST)