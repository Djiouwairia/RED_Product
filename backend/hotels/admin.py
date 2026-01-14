# hotels/admin.py
from django.contrib import admin
from hotels.models import Hotel

@admin.register(Hotel)
class HotelAdmin(admin.ModelAdmin):
    list_display = ['nom', 'adresse', 'email', 'telephone', 'prix_par_nuit', 'devise', 'created_by', 'created_at']
    list_filter = ['devise', 'created_at', 'created_by']
    search_fields = ['nom', 'adresse', 'email']
    ordering = ['-created_at']
    readonly_fields = ['created_at', 'updated_at', 'created_by']
    
    fieldsets = (
        ('Informations générales', {
            'fields': ('nom', 'adresse', 'email', 'telephone')
        }),
        ('Tarification', {
            'fields': ('prix_par_nuit', 'devise')
        }),
        ('Média', {
            'fields': ('image',)
        }),
        ('Métadonnées', {
            'fields': ('created_by', 'created_at', 'updated_at'),
            'classes': ('collapse',)
        }),
    )
    
    def save_model(self, request, obj, form, change):
        if not change:
            obj.created_by = request.user
        super().save_model(request, obj, form, change)