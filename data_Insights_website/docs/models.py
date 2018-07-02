from django.db import models


class DocumentationGroup(models.Model):
    title = models.CharField(max_length=50)
    description = models.TextField(default='Welcome to the docs page, if you are seeing this then it means there is no information here for us to display, Kindly click on the taps on your left to explore other options')
    pointsTo = models.CharField(max_length=50, default='learn')

class DocumentationSubGroup(models.Model):
    title = models.CharField(max_length=50)
    short_description = models.TextField()
    parent_group = models.ForeignKey(DocumentationGroup, on_delete=models.CASCADE)


class DocumentationEntryLearning(models.Model):
    title = models.CharField(max_length=50)
    icon = models.ImageField(blank=True)
    description = models.TextField(blank=True)
    image = models.ImageField(blank=True)
    source = models.URLField(blank=True) 
    pointsTo = models.CharField(max_length=50, unique=True)     
    parent = models.ForeignKey(
        "self",
        blank=True, 
        null=True, 
        related_name='subcategories',
        on_delete=models.CASCADE
    )

class DocumentationEntryVisual(models.Model):
    title = models.CharField(max_length=50)
    icon = models.ImageField(blank=True)
    description = models.TextField(blank=True)
    image = models.ImageField(blank=True)
    source = models.URLField(blank=True) 
    pointsTo = models.CharField(max_length=50, unique=True)     
    parent = models.ForeignKey(
        "self",
        blank=True, 
        null=True, 
        related_name='subcategories',
        on_delete=models.CASCADE
    )

class DocumentationEntryStat(models.Model):
    title = models.CharField(max_length=50)
    icon = models.ImageField(blank=True)
    description = models.TextField(blank=True)
    image = models.ImageField(blank=True)
    source = models.URLField(blank=True) 
    pointsTo = models.CharField(max_length=50, unique=True)     
    parent = models.ForeignKey(
        "self",
        blank=True, 
        null=True, 
        related_name='subcategories',
        on_delete=models.CASCADE
    )


class Faq(models.Model):
    question = models.TextField()
    answer = models.TextField()
    questionPtr = models.CharField(max_length=50)