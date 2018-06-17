from django.db import models


class LoadedData(models.Model):
    data = models.FileField()
