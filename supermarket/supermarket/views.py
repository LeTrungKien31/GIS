from django.shortcuts import render,get_object_or_404
from django.http import JsonResponse
from maps.models import Supermarket  
import json

def homepage(request):
    supermarkets = Supermarket.objects.all()  # Lấy dữ liệu từ bảng `supermarkets`
    return render(request, 'home/home.html', {'supermarkets': supermarkets})

def supermarket_detail(request, id):
    supermarket = get_object_or_404(Supermarket, id=id)
    return render(request, 'home/details.html', {'supermarket': supermarket})
def map_view(request):
    return render(request, 'home/search.html')

def search_supermarkets(request):
    query = request.GET.get('q', '')
    supermarkets = list(Supermarket.objects.filter(name__icontains=query).values(
        "id", "name", "address", "latitude", "longitude"
    )) if query else []

    context = {
        "query": query,
        "supermarkets": json.dumps(supermarkets)  # Đảm bảo dữ liệu là JSON
    }
    return render(request, 'home/search.html', context)