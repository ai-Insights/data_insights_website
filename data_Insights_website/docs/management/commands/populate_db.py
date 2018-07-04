from django.core.management.base import BaseCommand
from data_Insights_website.docs.models import *


class Command(BaseCommand):
    args = ''
    help = 'Populate the docs db automatically'

    def _create_docs_groups(self):
        grouplearning = DocumentationGroup(
            title='Learning algorithms',
            description='Create buttons to open specific tab content. All <div> elements with class="tabcontent" are hidden by default (with CSS & JS). When the user clicks on a button - it will open the tab content that "matches" this button.',
            pointsTo='learn'
        )
        grouplearning.save()

        groupvisualization = DocumentationGroup(
            title='Visualization',
            description='(with CSS & JS). When the user clicks on a button - it will open the tab content that "matches" this button.,Create buttons to open specific tab content. All <div> elements with class="tabcontent" are hidden by default', 
            pointsTo='visuals'
        )
        groupvisualization.save()

        groupstatistics = DocumentationGroup(
            title='Statistics',
            description='elements with class="tabcontent" are hidden by default (with CSS & JS). When the user clicks on a button - Create buttons to open specific tab content. All <div> it will open the tab content that "matches" this button.',
            pointsTo='stats'
        )
        groupstatistics.save()

        groupfaqs = DocumentationGroup(
            title='Q/A',
            pointsTo='faqs'
        )
        groupfaqs.save()

    def _create_docs_stats_entries(self):
        learning = DocumentationEntryStat(
            title='Lrning algoriteahms',
            description='',
            pointsTo='1',
        )
        learning.save()

        visualization = DocumentationEntryStat(
            title='Visutionaliza',
            description='',
            pointsTo='2',
        )
        visualization.save()

        statistics = DocumentationEntryStat(
            title='Sisticstat',
            description='',
            pointsTo='3',
        )
        statistics.save()
        faqs = DocumentationEntryStat(
            title='manQ/A',
            description='Hello i am developing an advanced ebay store and listing and would like to use jquery with it. Now i want to stay well in ebays rules and use javascript that they have deamed safe. I know of 2 ways of bypassing there detection script to use code that they have banned but i dont want to do this and stick to the rules incase they see my listing and ban me or someone or a competitor reports me.',
            pointsTo='5',
            parent = DocumentationEntryStat.objects.get(title='Sisticstat')
        )
        faqs.save()
        visualization2 = DocumentationEntryStat(
            title='Visuizational',
            description='now the standard Jquery application has replace() all over it. My question is - is there another javascript function i could use in place of Replace() in jquery and i will just go through it and add the new function in place of Replace()? Or can i create a new function in pure javascript to replicate the replace() functionality',
            pointsTo='6',
            parent = DocumentationEntryStat.objects.get(title='Sisticstat')
        )
        visualization2.save()

        statistics2 = DocumentationEntryStat(
            title='Staicstist',
            description='When you create an account, we remember exactly what youve read, so you always come right back where you left off. You also get notifications, here and via email, whenever new posts are made. And you can like posts to share the love',
            pointsTo='7',
            parent = DocumentationEntryStat.objects.get(title='Sisticstat')
        )
        statistics2.save()

    def handle(self, *args, **options):
        self._create_docs_groups()
        self._create_docs_stats_entries()
    
    
    