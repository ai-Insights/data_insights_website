from django.shortcuts import render
from django.views.generic.list import ListView
from .models import *

class DocsView(ListView):
    context_object_name = 'my_nav_pills'     
    template_name = 'pages/docs.html'
    queryset = DocumentationGroup.objects.all()
    ordering = ['id']

    def get_context_data(self, **kwargs):
        context = super(DocsView, self).get_context_data(**kwargs)
        context['QA'] = Faq.objects.all()
       # context['sub_list'] = DocumentationEntry.objects.all()
        context['learn_main_list'] = DocumentationEntryLearning.objects.filter(parent=None)
        context['learn_leaf_list'] = DocumentationEntryLearning.objects.exclude(description='').order_by('parent')
        context['learn_list'] = DocumentationEntryLearning.objects.all().exclude(parent=None).order_by('-parent')
        context['visual_main_list'] = DocumentationEntryVisual.objects.filter(parent=None)
        context['visual_leaf_list'] = DocumentationEntryVisual.objects.exclude(description='').order_by('parent')
        context['visual_list'] = DocumentationEntryVisual.objects.all().exclude(parent=None).order_by('-parent')
        context['stat_main_list'] = DocumentationEntryStat.objects.filter(parent=None)
        context['stat_leaf_list'] = DocumentationEntryStat.objects.exclude(description='').order_by('parent')
        context['stat_list'] = DocumentationEntryStat.objects.all().exclude(parent=None).order_by('-parent')
        # And so on for more models
        return context