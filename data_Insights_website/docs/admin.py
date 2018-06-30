from django.contrib import admin
from .models import DocumentationEntry, DocumentationGroup, DocumentationSubGroup


admin.site.register(DocumentationGroup)
admin.site.register(DocumentationSubGroup)
admin.site.register(DocumentationEntry)