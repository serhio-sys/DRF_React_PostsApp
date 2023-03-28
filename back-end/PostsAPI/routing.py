from django.urls import re_path

from .consumers import ChatConsumer,ChatConsumer2

websocket_urlpatterns = [
    re_path(r'^ws/chat/(?P<room_name>\w+)/$',ChatConsumer.as_asgi()),
    re_path(r'^ws/chat/', ChatConsumer2.as_asgi())
]