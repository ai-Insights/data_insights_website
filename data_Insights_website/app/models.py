from uuid import uuid4

from django.conf import settings
from django.db import models


def data_directory_path_with_uuid(instance, filename):
    return '{}{}'.format(uuid4(), filename)

class DataFile(models.Model):
    data = models.FileField(upload_to=data_directory_path_with_uuid)
    uploaded = models.DateTimeField(auto_now_add=True)

