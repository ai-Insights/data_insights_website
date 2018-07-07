import pandas
import numpy as np
from pandas.errors import ParserError
from sklearn.preprocessing import Imputer
from django.views import View
from django.shortcuts import render, redirect, reverse
from .forms import DataFileForm
from .models import DataFile


class DataFileView(View):
    form_class = DataFileForm
    template_name = 'pages/app_load_data.html'

    def get(self, request, *args, **kwargs):
        form = self.form_class()
        return render(request, self.template_name,
                      {'form': form,
                       'app_menu': 0})

    def post(self, request, *arg, **kwargs):
        form = self.form_class(request.POST, request.FILES)
        if form.is_valid():
            data = form.cleaned_data['data']
            instance = DataFile(data=form.cleaned_data['data'])
            if '.csv' in data.name:
                try:
                    df = pandas.read_csv(data)
                    instance.save()
                    return redirect(
                        reverse(
                            'data', kwargs={'data_id': instance.pk}))
                except ParserError:
                    print("File can't be parsed")
            elif any(ext in data.name for ext in ['.xls', '.xlsx']):
                try:
                    df = pandas.read_excel(data)
                    instance.save()
                    return redirect(
                        reverse(
                            'data', kwargs={'data_id': instance.pk}))
                except ParserError:
                    print("File can't be parsed")
            elif '.tsv' in data.name:
                try:
                    df = pandas.read_table(data)
                    instance.save()
                    return redirect(
                        reverse(
                            'data', kwargs={'data_id': instance.pk}))
                except ParserError:
                    print("File can't be parsed")
            else:
                print('File format not supported')
        return render(request, self.template_name,
                      {'form': form,
                       'app_menu': 0})


def AppView(request, data_id):
    data = DataFile.objects.get(pk=data_id)
    if '.csv' in data.data.name:
        df = pandas.read_csv(data.data)
    elif any(ext in data.data.name for ext in ['.xls', 'xlsx']):
        df = pandas.read_excel(data.data, header=None)
    else:
        df = pandas.read_table(data.data)

    ### Missing data resolution

    ## Replacing the missing data with the mean
    imputer = Imputer(missing_values=np.nan, strategy='median', axis=0)
    for column in df.columns:
        if any(stype == df[column].dtype for stype in ['float64', 'int64']):
            df[[column]] = imputer.fit_transform(df[[column]])

    json = df.to_json(orient='records')
    columns = [{'field': f, 'title': f} for f in df.columns]

    #stats
    df_num = df.columns.to_series().groupby(df.dtypes).groups
    cols = {k.name: v for k, v in df_num.items()}

    df_num = df[cols.get('float64', []).append(cols.get('int64', []))]
    for column in df_num.columns:
        if df_num[column].isnull().sum() > 0:
            df_num.drop(column)

    ctx = {
        'data': json,
        'columns': columns,
        'num_cols': df_num.columns.tolist(),
        'num_data': df_num.to_json(),
        'app_menu': 0,
    }
    return render(request, 'pages/app_load_success.html', ctx)
