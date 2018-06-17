from django.shortcuts import render

def docs(request):
    return render(request, 'pages/docs.html')
