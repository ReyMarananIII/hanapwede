import json
from channels.generic.websocket import AsyncWebsocketConsumer
from asgiref.sync import sync_to_async
from hanapwedeApp.models import ChatRooms, Messages, User

class ChatConsumer(AsyncWebsocketConsumer):
    async def connect(self):
        self.room_name = self.scope["url_route"]["kwargs"]["room_name"]
        self.room_group_name = f"chat_{self.room_name}"

        await self.channel_layer.group_add(self.room_group_name, self.channel_name)
        await self.accept()

    async def disconnect(self, close_code):
        await self.channel_layer.group_discard(self.room_group_name, self.channel_name)

    async def receive(self, text_data):
        data = json.loads(text_data)
        message = data["message"]
        sender_username = data["sender"]
      
        sender = await sync_to_async(User.objects.get)(username=sender_username)
        chat_room = await sync_to_async(ChatRooms.objects.get)(id=self.room_name)

   
        new_message = await sync_to_async(Messages.objects.create)(
            room=chat_room, sender=sender, content=message
        )

       
        await self.channel_layer.group_send(
            self.room_group_name,
            {
                "type": "chat_message",
                "message": message,
                "sender": sender.username,
                "timestamp": str(new_message.timestamp),
            },
        )

    async def chat_message(self, event):
        await self.send(text_data=json.dumps(event))