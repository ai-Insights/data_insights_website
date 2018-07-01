from django.urls import path
from . import views

urlpatterns = [
    path('', views.collect_data, name='collect_data'),
    path('loaded_data', views.loaded_data, name='loaded_data'),
    path('viz', views.viz, name="viz")
]