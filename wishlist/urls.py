from django.urls import path
from django.conf import settings
from django.conf.urls.static import static
from .views import item_list, edit_item, delete_item, reserve_item, change_order


urlpatterns = [
    path('', item_list, name='item_list'),
    path('edit/<int:item_id>/', edit_item, name='edit_item'),
    path('add/', edit_item, name='add_item'),
    path('delete/<int:item_id>/', delete_item, name='delete_item'),
    path('reserve/<int:item_id>/', reserve_item, name='reserve_item'),
    path('change_order/', change_order, name='change_order'),
] + static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
