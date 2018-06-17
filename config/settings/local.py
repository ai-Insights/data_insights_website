from .base import *
from .base import env

DEBUG = True
SECRET_KEY = env('SECRET_KEY')
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
