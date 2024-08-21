from django.contrib import admin
from .models import Item, ApiRequestLog


admin.site.register(Item)


@admin.register(ApiRequestLog)
class ApiRequestLogAdmin(admin.ModelAdmin):
    list_display = ('api_name', 'ip_address', 'request_time')
