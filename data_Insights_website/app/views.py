from django.shortcuts import render

def collect_data(request):
    return render(request, 'pages/app.html')