import pandas
import numpy as np
import csv
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
        has_header = request.POST.get('has_header')
        print(has_header)
        if form.is_valid():
            data = form.cleaned_data['data']
            instance = DataFile(data=data, header=has_header, clean_data=data)
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
    if '.csv' in data.clean_data.name:
        df = pandas.read_csv(data.clean_data) if data.header.tobytes().decode('utf8') == '1' else pandas.read_csv(data.clean_data, header=None)
    elif any(ext in data.clean_data.name for ext in ['.xls', 'xlsx']):
        df = pandas.read_excel(data.clean_data) if data.header.tobytes().decode('utf8') == '1' else pandas.read_excel(data.clean_data, header=None)
    else:
        df = pandas.read_table(data.clean_data) if data.header.tobytes().decode('utf8') == '1' else pandas.read_table(data.clean_data, header=None)
    
    has_header = data.header.tobytes().decode('utf8')

    imputer_median = Imputer(missing_values=np.nan, strategy='median', axis=0)
    imputer_mean = Imputer(missing_values=np.nan, strategy='mean', axis=0)
    if request.method == 'POST':
        
        missing_mean = request.POST.getlist("missing_mean")
        missing_median = request.POST.getlist("missing_median")
        missing_value = request.POST.getlist("missing_value")
        value = request.POST.get('uvalue')

        print(value)
    
        for column in missing_mean:
            for columnIndex in df.columns.tolist():
                if str(columnIndex) == str(column):
                    df[[columnIndex]] = imputer_mean.fit_transform(df[[columnIndex]])
        
        for column in missing_median:
            for columnIndex in df.columns.tolist():
                if str(columnIndex) == str(column):
                    df[[columnIndex]] = imputer_mean.fit_transform(df[[columnIndex]])
        
        for column in missing_value:
            for columnIndex in df.columns.tolist():
                if str(columnIndex) == str(column):
                    df[columnIndex] = df[columnIndex].fillna(value)
        
        if '.csv' in data.clean_data.name:
            df.to_csv(data.clean_data.path, index=False) if data.header.tobytes().decode('utf8') == '1' else df.to_csv(data.clean_data.path, header=False, index=False)
        elif any(ext in data.clean_data.name for ext in ['.xls', 'xlsx']):
            df.to_excel(data.clean_data.path, index=False) if data.header.tobytes().decode('utf8') == '1' else df.to_excel(data.clean_data.path, header=False, index=False)
        else:
            df.to_table(data.clean_data.path, index=False) if data.header.tobytes().decode('utf8') == '1' else df.read_table(data.clean_data.path, header=False, index=False)
        
        data.save()
        
    json = df.to_json(orient='records')
    #columns with missing values
    columns = [column for column in df.columns if df[column].isnull().sum() > 0]
    ncolumns = [column for column in columns if any(column_dtype == df[column].dtype.__str__() for column_dtype in ['float64', 'int64'])]
    ctx = {
        'data': json,
        'dfcolumns':columns,
        'numeric_dfcolumns': ncolumns,
        'columns': [{'field': f, 'title': f} for f in df.columns],
        'app_menu': 0
    }
    return render(request, 'pages/app_clean_data.html', ctx)


def DataView(request, data_id):
    data = DataFile.objects.get(pk=data_id)
    if '.csv' in data.clean_data.name:
        df = pandas.read_csv(data.clean_data) if data.header.tobytes().decode('utf8') == '1' else pandas.read_csv(data.clean_data, header=None)
    elif any(ext in data.clean_data.name for ext in ['.xls', 'xlsx']):
        df = pandas.read_excel(data.clean_data) if data.header.tobytes().decode('utf8') == '1' else pandas.read_excel(data.clean_data, header=None)
    else:
        df = pandas.read_table(data.clean_data) if data.header.tobytes().decode('utf8') == '1' else pandas.read_table(data.clean_data, header=None)
    
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