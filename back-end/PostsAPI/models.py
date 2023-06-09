from django.db import models
from django.contrib.auth import get_user_model
from django.contrib.auth.models import AbstractUser

class User(AbstractUser):
    followers_ct = models.PositiveIntegerField(blank=True,default=0)
    followers = models.ManyToManyField("User",related_name="followers_l",blank=True,default=None)

    class Meta(AbstractUser.Meta):
       swappable = 'AUTH_USER_MODEL'

class Chat(models.Model):
    users = models.ManyToManyField(User,related_name="chat",blank=True,default=None)


class Message(models.Model):
    msg = models.CharField("Message",max_length=255)
    user = models.ForeignKey(User,verbose_name="USER",on_delete=models.CASCADE)
    chat = models.ForeignKey(Chat,verbose_name="CHAT",on_delete=models.CASCADE)


class Post(models.Model):
    title = models.CharField("title of post",max_length=30)
    desk = models.TextField("description of post")
    likes_ct = models.IntegerField(verbose_name="count of likes",default=0)
    creator = models.ForeignKey(User,verbose_name="creator",on_delete=models.CASCADE)
    likes = models.ManyToManyField(User,related_name="liked",blank=True,default=None)
    