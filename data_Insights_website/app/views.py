import pandas
from pandas.errors import ParserError
from django.views import View
from django.shortcuts import render, redirect, reverse
from .forms import DataFileForm
from .models import DataFile


class DataFileView(View):
    form_class = DataFileForm
    template_name = 'pages/app_load_data.html'
    def get(self, request, *args, **kwargs):
        form = self.form_class()
        return render(request, self.template_name, {'form': form})
    
    def post(self, request, *arg, **kwargs):
        form = self.form_class(request.POST, request.FILES)
        if form.is_valid():
            data = form.cleaned_data['data']
            instance = DataFile(data=form.cleaned_data['data'])
            if '.csv' in data.name:
                try:
                    df = pandas.read_csv(data)
                    instance.save()
                    return redirect(reverse('data', kwargs={'data_id': instance.pk}))
                except ParserError:
                    print("File can't be parsed")
            elif any(ext in data.name for ext in ['.xls', '.xlsx']):
                try:
                    df = pandas.read_excel(data)
                    instance.save()
                    return redirect('data')
                except ParserError:
                    print("File can't be parsed")
            elif '.tsv' in data.name:
                try:
                    df = pandas.read_table(data)
                    instance.save()
                    return redirect('data')
                except ParserError:
                    print("File can't be parsed")
            else:
                print('File format not supported')
        return render(request, self.template_name, {'form': form})


def AppView(request, data_id):
    return render(request, 'pages/app_load_success.html')

