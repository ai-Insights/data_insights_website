from django.db import models


class DocumentationGroup(models.Model):
    title = models.CharField(max_length=50)
    pointsTo = models.CharField(max_length=50, default='learn')

class DocumentationSubGroup(models.Model):
    title = models.CharField(max_length=50)
    short_description = models.TextField()
    parent_group = models.ForeignKey(DocumentationGroup, on_delete=models.CASCADE)


class DocumentationEntry(models.Model):
    title = models.CharField(max_length=50)
    icon = models.ImageField(blank=True)
    description = models.TextField()
    image = models.ImageField(blank=True)
    source = models.URLField(blank=True)
    group = models.ForeignKey(DocumentationGroup, on_delete=models.CASCADE)
