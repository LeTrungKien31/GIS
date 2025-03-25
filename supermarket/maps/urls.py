# maps/urls.py
from django.urls import path
from .views import supermarket_list  # Import hàm từ views.py
from . import views

app_name = 'maps'
urlpatterns = [
    path('supermarkets/', supermarket_list, name='supermarket_list'),
    path('test/', views.mapbasic, name='test')
]
