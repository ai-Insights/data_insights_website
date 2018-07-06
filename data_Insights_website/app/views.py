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
        return render(request, self.template_name, {'form': form, 'app_menu':0})
    
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
        return render(request, self.template_name, {'form': form, "app_menu": 0})


def AppView(request, data_id):
    data = DataFile.objects.get(pk=data_id)
    if '.csv' in data.data.name:
        df = pandas.read_csv(data.data)
    elif any(ext in data.data.name for ext in ['.xls', 'xlsx']):
        df = pandas.read_excel(data.data)
    else:
        df = pandas.read_table(data.data)
    json = df.to_json(orient='records')
    columns = [{'field': f, 'title': f} for f in df.columns]

    #stats
    df_num = df.columns.to_series().groupby(df.dtypes).groups
    cols = {k.name: v for k, v in df_num.items()}

    df_num = df[cols.get('float64', []).append(cols.get('int64', []))].to_json()
    cols = (cols.get('float64', []).append(cols.get('int64', []))).tolist()

    ctx = {
        'data': json,
        'columns': columns,
        'num_cols': cols,
        'num_data': df_num,

        'app_menu': 0,
    }
    return render(request, 'pages/app_load_success.html', ctx)

