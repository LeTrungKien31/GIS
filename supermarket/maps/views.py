from django.shortcuts import render
from django.http import JsonResponse
from .models import Supermarket
import json
def supermarket_list(request):
    supermarkets = Supermarket.objects.all()
    return render(request, 'home/home.html', {'supermarkets': supermarkets})

def mapbasic(request):
    supermarkets = Supermarket.objects.all() # Lấy tất cả các siêu thị từ cơ sở dữ liệu
    supermarkets_list = list(supermarkets.values('name', 'address', 'latitude', 'longitude', 'image'))  # Chuyển thành list dictionary
    supermarkets_json = json.dumps(supermarkets_list)  # Chuyển thành JSON
    return render(request, 'map.html', {'supermarkets': supermarkets_json})

def hiddenmap(request):
    return render(request, 'hidden_map.html')

def search_location(request):
   return render(request, 'search_location.html')

def guide(request):
    return render(request, 'guide.html')
def get_supermarkets(request):
    supermarkets = Supermarket.objects.values('id', 'name', 'address', 'latitude', 'longitude', 'image')
    return JsonResponse(list(supermarkets), safe=False)
