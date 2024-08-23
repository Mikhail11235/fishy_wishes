import json
from functools import wraps
from django.shortcuts import render, get_object_or_404, redirect
from django.contrib.auth.decorators import login_required
from django.contrib.admin.views.decorators import staff_member_required
from django.http import HttpResponseForbidden, JsonResponse, HttpResponseBadRequest, HttpResponseNotFound
from django.utils.translation import gettext as _
from .models import Item, ApiRequestLog
from .forms import ItemForm


def log_api_request(api_name):
    def decorator(func):
        @wraps(func)
        def wrapper(request, *args, **kwargs):
            response = func(request, *args, **kwargs)
            if response.status_code == 200:
                ip_address = get_client_ip(request)
                ApiRequestLog.objects.create(api_name=api_name, ip_address=ip_address)
            return response
        return wrapper
    return decorator


def get_client_ip(request):
    x_forwarded_for = request.META.get('HTTP_X_FORWARDED_FOR')
    if x_forwarded_for:
        ip = x_forwarded_for.split(',')[0]
    else:
        ip = request.META.get('REMOTE_ADDR')
    return ip


def item_list(request):
    items = Item.objects.all().order_by('is_reserved', 'order')
    return render(request, 'item_list.html', {'items': items})


@staff_member_required
def edit_item(request, item_id=None):
    if item_id:
        item = get_object_or_404(Item, id=item_id)
    else:
        item = None
    if request.method == 'POST':
        form = ItemForm(request.POST, request.FILES, instance=item)
        if form.is_valid():
            form.save()
            return redirect('item_list')
    else:
        form = ItemForm(instance=item)
    return render(request, 'edit_item.html', {'form': form, 'item': item})


@staff_member_required
def delete_item(request, item_id):
    item = get_object_or_404(Item, id=item_id)
    if request.method == 'DELETE':
        item.delete()
        return JsonResponse({"status": 0})
    return HttpResponseForbidden()


@log_api_request(api_name='reserve')
@login_required
def reserve_item(request, item_id):
    item = get_object_or_404(Item, id=item_id)
    if item.not_reservable:
        return HttpResponseForbidden()
    if request.method == 'POST':
        if request.GET.get("checked") == "0" and item.is_reserved:
            return JsonResponse({"conflict": True})
        item.is_reserved = not item.is_reserved
        item.save()
        return JsonResponse({"is_reserved": item.is_reserved, "item_id": item.pk})
    return HttpResponseForbidden()


@staff_member_required
def change_order(request):
    print(1)
    if request.method == 'PATCH':
        try:
            data = json.loads(request.body)
            order = data.get('order', [])
            if not isinstance(order, list) or \
                    not all(isinstance(item, dict) and 'id' in item and 'order' in item for item in order):
                return HttpResponseBadRequest()
            for item_data in order:
                item_id = item_data.get('id')
                item_order = item_data.get('order')
                try:
                    item = Item.objects.get(id=item_id)
                    item.order = item_order
                    item.save()
                except Item.DoesNotExist:
                    return HttpResponseNotFound()
            return JsonResponse({'status': 0})
        except json.JSONDecodeError:
            return HttpResponseBadRequest()
    return HttpResponseForbidden()
