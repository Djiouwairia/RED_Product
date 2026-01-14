from rest_framework import generics, status, permissions
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework.decorators import api_view, permission_classes
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework_simplejwt.views import TokenObtainPairView
from django.contrib.auth import get_user_model
from django.db.models import Count, Avg
from accounts.serializers import (
    RegisterSerializer, 
    UserSerializer, 
    LoginSerializer,
    ChangePasswordSerializer,
    PasswordResetRequestSerializer
)
from hotels.models import Hotel

User = get_user_model()


class RegisterView(generics.CreateAPIView):
    """
    API endpoint pour l'inscription des utilisateurs
    """
    queryset = User.objects.all()
    permission_classes = [permissions.AllowAny]
    serializer_class = RegisterSerializer
    
    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        user = serializer.save()
        
        # Générer les tokens JWT
        refresh = RefreshToken.for_user(user)
        
        return Response({
            'user': UserSerializer(user).data,
            'message': 'Utilisateur créé avec succès',
            'tokens': {
                'refresh': str(refresh),
                'access': str(refresh.access_token),
            }
        }, status=status.HTTP_201_CREATED)


class LoginView(TokenObtainPairView):
    """
    API endpoint pour la connexion des utilisateurs
    Hérite de TokenObtainPairView pour gérer JWT
    """
    permission_classes = [permissions.AllowAny]
    
    def post(self, request, *args, **kwargs):
        response = super().post(request, *args, **kwargs)
        
        if response.status_code == 200:
            # Ajouter les infos utilisateur à la réponse
            try:
                user = User.objects.get(email=request.data.get('email'))
                response.data['user'] = UserSerializer(user).data
            except User.DoesNotExist:
                pass
        
        return response


class ProfileView(generics.RetrieveUpdateAPIView):
    """
    API endpoint pour voir et modifier le profil utilisateur
    """
    permission_classes = [permissions.IsAuthenticated]
    serializer_class = UserSerializer
    
    def get_object(self):
        return self.request.user
    
    def update(self, request, *args, **kwargs):
        partial = kwargs.pop('partial', False)
        instance = self.get_object()
        serializer = self.get_serializer(instance, data=request.data, partial=partial)
        serializer.is_valid(raise_exception=True)
        self.perform_update(serializer)
        
        return Response({
            'user': serializer.data,
            'message': 'Profil mis à jour avec succès'
        })


class ChangePasswordView(APIView):
    """
    API endpoint pour changer le mot de passe
    """
    permission_classes = [permissions.IsAuthenticated]
    
    def post(self, request):
        serializer = ChangePasswordSerializer(
            data=request.data,
            context={'request': request}
        )
        
        if serializer.is_valid():
            user = request.user
            user.set_password(serializer.validated_data['new_password'])
            user.save()
            
            return Response({
                'message': 'Mot de passe changé avec succès'
            }, status=status.HTTP_200_OK)
        
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class PasswordResetRequestView(APIView):
    """
    API endpoint pour demander la réinitialisation du mot de passe
    """
    permission_classes = [permissions.AllowAny]
    
    def post(self, request):
        serializer = PasswordResetRequestSerializer(data=request.data)
        
        if serializer.is_valid():
            email = serializer.validated_data['email']
            
            # Dans une vraie application, vous enverriez un email ici
            # Pour l'instant, on retourne juste un message de succès
            
            return Response({
                'message': 'Si un compte existe avec cet email, un lien de réinitialisation a été envoyé.'
            }, status=status.HTTP_200_OK)
        
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class LogoutView(APIView):
    """
    API endpoint pour la déconnexion
    Blacklist le refresh token
    """
    permission_classes = [permissions.IsAuthenticated]
    
    def post(self, request):
        try:
            refresh_token = request.data.get("refresh_token")
            token = RefreshToken(refresh_token)
            token.blacklist()
            
            return Response({
                'message': 'Déconnexion réussie'
            }, status=status.HTTP_200_OK)
        except Exception as e:
            return Response({
                'error': 'Token invalide'
            }, status=status.HTTP_400_BAD_REQUEST)


class UserListView(generics.ListAPIView):
    """
    API endpoint pour lister tous les utilisateurs (admin uniquement)
    """
    queryset = User.objects.all()
    serializer_class = UserSerializer
    permission_classes = [permissions.IsAuthenticated]
    
    def get_queryset(self):
        # Seuls les admins peuvent voir tous les utilisateurs
        if self.request.user.is_admin:
            return User.objects.all()
        # Les autres utilisateurs ne voient qu'eux-mêmes
        return User.objects.filter(id=self.request.user.id)


@api_view(['GET'])
@permission_classes([permissions.IsAuthenticated])
def dashboard_stats(request):
    """
    Retourne les statistiques du dashboard
    """
    # Compter les utilisateurs
    total_users = User.objects.count()
    admin_users = User.objects.filter(is_admin=True).count()
    regular_users = total_users - admin_users
    
    # Compter les hôtels
    total_hotels = Hotel.objects.count()
    hotels_by_devise = {
        'XOF': Hotel.objects.filter(devise='XOF').count(),
        'EUR': Hotel.objects.filter(devise='EUR').count(),
        'USD': Hotel.objects.filter(devise='USD').count(),
    }
    
    # Prix moyen des hôtels
    avg_price = Hotel.objects.aggregate(avg_prix=Avg('prix_par_nuit'))['avg_prix'] or 0
    
    # Statistiques des messages
    from messaging.models import Message
    from django.db.models import Q
    
    total_messages_recus = Message.objects.filter(destinataire=request.user).count()
    total_messages_envoyes = Message.objects.filter(expediteur=request.user).count()
    messages_non_lus = Message.objects.filter(destinataire=request.user, status='sent').count()
    total_messages = Message.objects.filter(
        Q(expediteur=request.user) | Q(destinataire=request.user)
    ).distinct().count()
    
    # Statistiques par utilisateur (pour l'admin)
    user_stats = []
    if request.user.is_admin:
        users_with_hotels = User.objects.annotate(
            hotel_count=Count('hotels')
        ).filter(hotel_count__gt=0)[:5]
        
        user_stats = [
            {
                'username': user.username,
                'email': user.email,
                'hotels_count': user.hotel_count
            }
            for user in users_with_hotels
        ]
    
    # Statistiques générales
    stats = {
        'utilisateurs': {
            'total': total_users,
            'admins': admin_users,
            'reguliers': regular_users,
            'subtitle': f'{total_users} utilisateurs au total'
        },
        'hotels': {
            'total': total_hotels,
            'par_devise': hotels_by_devise,
            'prix_moyen': round(avg_price, 2),
            'subtitle': f'{total_hotels} hôtels enregistrés'
        },
        'formulaires': {
            'total': total_users,  # On peut utiliser les inscriptions comme formulaires
            'subtitle': 'Inscriptions d\'utilisateurs'
        },
        'messages': {
            'total': total_messages,
            'recus': total_messages_recus,
            'envoyes': total_messages_envoyes,
            'non_lus': messages_non_lus,
            'subtitle': f'{messages_non_lus} messages non lus'
        },
        'emails': {
            'total': total_users,  # Nombre d'emails enregistrés
            'subtitle': f'{total_users} emails enregistrés'
        },
        'endes': {
            'total': Hotel.objects.filter(created_by=request.user).count() if not request.user.is_admin else total_hotels,
            'subtitle': 'Hôtels créés'
        },
        'top_contributors': user_stats
    }
    
    return Response(stats, status=status.HTTP_200_OK)