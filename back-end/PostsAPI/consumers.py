# chat/consumers.py
import json

from asgiref.sync import async_to_sync
from channels.generic.websocket import AsyncWebsocketConsumer,WebsocketConsumer
from channels.db import database_sync_to_async
from .models import Message,get_user_model,Chat

class ChatConsumer(AsyncWebsocketConsumer):
    @database_sync_to_async
    def createMessage(self,msg,user_id):
        Message.objects.create(msg=msg,user=get_user_model().objects.get(pk=user_id),chat=Chat.objects.get(pk=self.room_name)).save()

    async def connect(self):
        self.room_name = self.scope["url_route"]["kwargs"]["room_name"]
        self.room_group_name = "chat_%s" % self.room_name

        # Join room group
        await self.channel_layer.group_add(self.room_group_name, self.channel_name)

        await self.accept()

    async def disconnect(self, close_code):
        # Leave room group
        await self.channel_layer.group_discard(self.room_group_name, self.channel_name)

    # Receive message from WebSocket
    async def receive(self, text_data):
        text_data_json = json.loads(text_data)
        message = text_data_json["message"]
        user = text_data_json['user']
        user_id = text_data_json['user_id']
        await self.createMessage(message,user_id)
        # Send message to room group
        await self.channel_layer.group_send(
            self.room_group_name, {"type": "chat_message", "message": message, "user":user, "user_id":user_id}
        )

    # Receive message from room group
    async def chat_message(self, event):
        message = event["message"]
        user = event["user"]
        user_id = event["user_id"]
        # Send message to WebSocke
        await self.send(text_data=json.dumps({"message": message,"user":user}))

class ChatConsumer2(WebsocketConsumer):
    def connect(self):
        self.room_name = self.scope['url_route']['kwargs']
        self.room_group_name = 'chat'

        print("HELLO WORLD")
        # Join room group
        async_to_sync(self.channel_layer.group_add)(
            self.room_group_name,
            self.channel_name
        )

        self.accept()

    def disconnect(self, close_code):
        # Leave room group
        async_to_sync(self.channel_layer.group_discard)(
            self.room_group_name,
            self.channel_name
        )