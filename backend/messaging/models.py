from django.db import models
from accounts.models import User


class Message(models.Model):
    """
    Modèle pour les messages entre utilisateurs
    """
    STATUS_CHOICES = [
        ('sent', 'Envoyé'),
        ('read', 'Lu'),
        ('archived', 'Archivé'),
    ]
    
    expediteur = models.ForeignKey(
        User, 
        on_delete=models.CASCADE, 
        related_name='messages_envoyes',
        verbose_name="Expéditeur"
    )
    destinataire = models.ForeignKey(
        User, 
        on_delete=models.CASCADE, 
        related_name='messages_recus',
        verbose_name="Destinataire"
    )
    sujet = models.CharField(max_length=255, verbose_name="Sujet")
    contenu = models.TextField(verbose_name="Contenu")
    status = models.CharField(
        max_length=20, 
        choices=STATUS_CHOICES, 
        default='sent',
        verbose_name="Statut"
    )
    date_envoi = models.DateTimeField(auto_now_add=True, verbose_name="Date d'envoi")
    date_lecture = models.DateTimeField(null=True, blank=True, verbose_name="Date de lecture")
    
    class Meta:
        db_table = 'messaging_message'
        verbose_name = 'Message'
        verbose_name_plural = 'Messages'
        ordering = ['-date_envoi']
    
    def __str__(self):
        return f"{self.sujet} - De: {self.expediteur.username} À: {self.destinataire.username}"
    
    def marquer_comme_lu(self):
        """Marquer le message comme lu"""
        from django.utils import timezone
        if self.status == 'sent':
            self.status = 'read'
            self.date_lecture = timezone.now()
            self.save()