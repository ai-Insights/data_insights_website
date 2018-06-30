from django.shortcuts import render
from django.views.generic.list import ListView
from .models import DocumentationEntry, DocumentationGroup, DocumentationSubGroup


class NavPills(ListView):
    model = DocumentationGroup

    queryset = DocumentationGroup.objects
    template_name = 'pages/docs.html'