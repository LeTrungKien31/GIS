from django.shortcuts import render
from .models import Supermarket
import json
def supermarket_list(request):
    supermarkets = Supermarket.objects.all()
    return render(request, 'home/home.html', {'supermarkets': supermarkets})
# def mapbasic(request):
#     return render(request, "map.html"
def mapbasic(request):
    supermarkets = Supermarket.objects.all()  # Lấy tất cả dữ liệu từ database
    supermarkets_list = list(supermarkets.values('name', 'address', 'latitude', 'longitude'))  # Chuyển thành list dictionary
    supermarkets_json = json.dumps(supermarkets_list)  # Chuyển thành JSON
    
    return render(request, 'map.html', {'supermarkets': supermarkets_json})
