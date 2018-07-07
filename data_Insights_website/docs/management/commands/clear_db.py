from django.core.management.base import BaseCommand
from data_Insights_website.docs.models import *


class Command(BaseCommand):
    args = ''
    help = 'Clear docs db'

    def handle(seld, *args, **options):
        DocumentationGroup.objects.all().delete()
        DocumentationEntryStat.objects.all().delete()
