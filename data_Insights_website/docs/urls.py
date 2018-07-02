from django.urls import path
from . import views

urlpatterns = [
    path('', views.NavPills.as_view(), name='docs')
]