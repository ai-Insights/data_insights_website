from .base import *
from .base import env

DEBUG = True
SECRET_KEY = env('SECRET_KEY', default='nzgmg7lgxf+#yl*d6qq7hf4lce6ab@9+%18(i^2^=+($64t_wp')
ALLOWED_HOSTS = [
    "localhost",
    "0.0.0.0",
    "127.0.0.1",
]


TEMPLATES[0]['OPTIONS']['debug'] = DEBUG

# https://django-debug-toolbar.readthedocs.io/en/stable/installation.html
INTERNAL_IPS = ['127.0.0.1', '10.0.2.2']

INSTALLED_APPS += ['debug_toolbar']
MIDDLEWARE += ['debug_toolbar.middleware.DebugToolbarMiddleware']
DEBUG_TOOLBAR_CONFIG = {
    'DISABLE_PANELS': [
        'debug_toolbar.panels.redirects.RedirectsPanel',
    ],
    'SHOW_TEMPLATE_CONTEXT': True,
}

INSTALLED_APPS += ['django_extensions']
