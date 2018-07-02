from django.contrib import admin
from .models import *


admin.site.register(DocumentationGroup)
admin.site.register(DocumentationSubGroup)
admin.site.register(DocumentationEntryLearning)
admin.site.register(DocumentationEntryVisual)
admin.site.register(DocumentationEntryStat)
admin.site.register(Faq)