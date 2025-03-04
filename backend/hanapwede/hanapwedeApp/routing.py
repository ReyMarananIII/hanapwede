from django.urls import re_path
from hanapwedeApp.ChatConsumer import ChatConsumer

websocket_urlpatterns = [
    re_path(r"ws/chat/(?P<room_name>\w+)/$", ChatConsumer.as_asgi()),
]