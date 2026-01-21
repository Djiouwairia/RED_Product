from django.urls import path
from rest_framework_simplejwt.views import TokenRefreshView
from accounts.views import (
    RegisterView,
    LoginView,
    ProfileView,
    ChangePasswordView,
    PasswordResetRequestView,
    LogoutView,
    UserListView,
    dashboard_stats,
)
from accounts.management_views import (
    create_initial_superuser,
    create_test_data,
)

app_name = 'accounts'

urlpatterns = [
    # Authentification
    path('register/', RegisterView.as_view(), name='register'),
    path('login/', LoginView.as_view(), name='login'),
    path('logout/', LogoutView.as_view(), name='logout'),
    path('token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    
    # Profil utilisateur
    path('profile/', ProfileView.as_view(), name='profile'),
    path('users/', UserListView.as_view(), name='user-list'),
    
    # Dashboard
    path('dashboard/stats/', dashboard_stats, name='dashboard-stats'),
    
    # Gestion du mot de passe
    path('change-password/', ChangePasswordView.as_view(), name='change-password'),
    path('password-reset/', PasswordResetRequestView.as_view(), name='password-reset'),
    
    # Setup endpoints (À SUPPRIMER APRÈS UTILISATION)
    path('setup/create-superuser/', create_initial_superuser, name='create-superuser'),
    path('setup/create-test-data/', create_test_data, name='create-test-data'),
]