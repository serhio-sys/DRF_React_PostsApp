from django.contrib import admin
from .models import Post,User,Message,Chat

admin.site.register(Post)
admin.site.register(User)
admin.site.register(Message)
admin.site.register(Chat)
