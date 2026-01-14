from django.db import models
from accounts.models import User

class Hotel(models.Model):
    DEVISE_CHOICES = [
        ('XOF', 'F XOF'),
        ('EUR', 'EUR'),
        ('USD', 'USD'),
    ]
    
    nom = models.CharField(max_length=255, verbose_name="Nom de l'hôtel")
    adresse = models.TextField(verbose_name="Adresse")
    email = models.EmailField(verbose_name="E-mail")
    telephone = models.CharField(max_length=20, verbose_name="Numéro de téléphone")
    prix_par_nuit = models.DecimalField(max_digits=10, decimal_places=2, verbose_name="Prix par nuit")
    devise = models.CharField(max_length=3, choices=DEVISE_CHOICES, default='XOF')
    image = models.ImageField(upload_to='hotels/', null=True, blank=True, verbose_name="Photo")
    created_by = models.ForeignKey(User, on_delete=models.CASCADE, related_name='hotels')
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        db_table = 'hotels'
        verbose_name = 'Hôtel'
        verbose_name_plural = 'Hôtels'
        ordering = ['-created_at']
    
    def __str__(self):
        return self.nom