from django.urls import path
from django.views.generic import TemplateView
from .views import *

urlpatterns = [
    path(
        '', DataFileView.as_view(), name='DataFileView'), path(
            'viz', TemplateView.as_view(template_name='pages/viz.html')), path(
                'data/<int:data_id>', AppView, name='data')
]
