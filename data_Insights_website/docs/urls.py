from django.urls import path
from . import views

urlpatterns = [
    path('', views.DocsView.as_view(), name='docs'),
]