import os
from django.core.asgi import get_asgi_application
from channels.routing import ProtocolTypeRouter, URLRouter
from django.urls import re_path
from channels.auth import AuthMiddlewareStack

import django

os.environ.setdefault("DJANGO_SETTINGS_MODULE", "hanapwede.settings")
django.setup()
from hanapwedeApp.ChatConsumer import ChatConsumer
application = ProtocolTypeRouter(
    {
        "http": get_asgi_application(),
        "websocket": AuthMiddlewareStack(
            URLRouter(
                [
                        re_path(r"ws/chat/(?P<room_name>\w+)/$", ChatConsumer.as_asgi()),
                ]
            )
        ),
    }
)
