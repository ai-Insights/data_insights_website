from django.shortcuts import render, redirect
from .forms import UploadFileForm
from .models import LoadedData


def loaded_data(request):
    return render(request, 'pages/app_load_success.html')

def collect_data(request):
    if request.method == 'POST':
        form = UploadFileForm(request.POST, request.FILES)
        print('posting')
        if form.is_valid():
            instance = LoadedData(data=request.FILES['file'])
            instance.save()
            return redirect('loaded_data')
    else:
        form = UploadFileForm()
    return render(request, 'pages/app_load_data.html', {'form': form})