from django.urls import path, include
from supermarket.views import homepage  # Import trang chủ
from . import views
from . views import search_supermarkets
from . views import get_supermarkets  # Import hàm get_supermarkets từ views.py

urlpatterns = [
    path('', homepage, name='home'),  
    path('maps/', include('maps.urls')),  # Import đường dẫn maps.urls
    path('supermarket/<int:id>/', views.supermarket_detail, name='supermarket_detail'),
    path('search/', search_supermarkets, name="search_supermarkets"),
    path("api/supermarkets/", get_supermarkets, name="get_supermarkets")
]

