from django.contrib import admin
from .models import Item, ApiRequestLog


admin.site.register(Item, ApiRequestLog)
