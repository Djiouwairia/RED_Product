from django.contrib import admin
from messaging.models import Message


@admin.register(Message)
class MessageAdmin(admin.ModelAdmin):
    list_display = ['sujet', 'expediteur', 'destinataire', 'status', 'date_envoi', 'date_lecture']
    list_filter = ['status', 'date_envoi']
    search_fields = ['sujet', 'contenu', 'expediteur__username', 'destinataire__username']
    ordering = ['-date_envoi']
    readonly_fields = ['date_envoi', 'date_lecture']
    
    fieldsets = (
        ('Informations générales', {
            'fields': ('expediteur', 'destinataire', 'sujet', 'contenu')
        }),
        ('Statut', {
            'fields': ('status', 'date_envoi', 'date_lecture')
        }),
    )
    
    def has_add_permission(self, request):
        """Ne pas permettre l'ajout depuis l'admin"""
        return False