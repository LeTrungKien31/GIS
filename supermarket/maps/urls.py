# maps/urls.py
from django.urls import path
from .views import supermarket_list  # Import hàm từ views.py
from .views import get_supermarkets  # Import hàm từ views.py
from . import views

app_name = 'maps'
urlpatterns = [
    path('supermarkets/', supermarket_list, name='supermarket_list'),
    path('test/', views.mapbasic, name='test'),
    path('hiddenmap/', views.hiddenmap, name='hiddenmap'),
    path('search_location/', views.search_location, name='search_location'),
    path('guide/', views.guide, name='guide'),
      path("api/supermarkets/", get_supermarkets, name="get_supermarkets")  # API JSON
]
