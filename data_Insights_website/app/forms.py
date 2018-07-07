from django import forms

from .models import DataFile


class DataFileForm(forms.ModelForm):

    class Meta:
        model = DataFile
        fields = ['data']
