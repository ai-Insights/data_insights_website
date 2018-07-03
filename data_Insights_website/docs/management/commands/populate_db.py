from django.core.management.base import BaseCommand
from data_Insights_website.docs.models import *


class Command(BaseCommand):
    args = ''
    help = 'Populate the docs db automatically'

    def _create_docs_groups(self):
        grouplearning = DocumentationGroup(
            title='Learning algorithms',
            description='',
            pointsTo='learn'
        )
        grouplearning.save()

        groupvisualization = DocumentationGroup(
            title='Visualization',
            description='',
            pointsTo='visuals'
        )
        groupvisualization.save()

        groupstatistics = DocumentationGroup(
            title='Statistics',
            description='',
            pointsTo='stats'
        )
        groupstatistics.save()

        groupfaqs = DocumentationGroup(
            title='Q/A',
            description='',
            pointsTo='faqs'
        )
        groupfaqs.save()

    def handle(self, *args, **options):
        self._create_docs_groups()
