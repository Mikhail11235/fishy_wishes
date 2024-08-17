from django.db import models


class Item(models.Model):
    name = models.CharField(max_length=255)
    description = models.TextField(blank=True)
    url = models.CharField(max_length=255, blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)
    is_reserved = models.BooleanField(default=False)
    image = models.ImageField(upload_to='item_images/', blank=True, null=True)
    order = models.IntegerField(blank=True, null=True)

    def __str__(self):
        return self.name


class ApiRequestLog(models.Model):
    api_name = models.CharField(max_length=100)
    ip_address = models.GenericIPAddressField()
    request_time = models.DateTimeField(auto_now_add=True)
