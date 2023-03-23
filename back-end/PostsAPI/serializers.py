from rest_framework import serializers
from django.contrib.auth import get_user_model
from .models import *
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer

class MyTokenObtainSerializer(TokenObtainPairSerializer):
    @classmethod
    def get_token(cls, user):
        token = super().get_token(user)
        token['username'] = user.username

        return token

class UserSerializer(serializers.ModelSerializer):
    id = serializers.IntegerField(read_only=True)
    followers = serializers.StringRelatedField(read_only=True,many=True)
    class Meta:
        model = get_user_model()
        fields = ('id',"username","email","followers_ct","followers")

class UserCreationSerializer(serializers.Serializer):
    username = serializers.CharField(max_length=50)
    email = serializers.EmailField()
    password = serializers.CharField(max_length=20,min_length=8)
    password1 = serializers.CharField(max_length=20,min_length=8)
    


class PostSerializer(serializers.ModelSerializer):
    id = serializers.IntegerField(read_only=True)
    creator_id = serializers.IntegerField(read_only=True)
    likes_ct = serializers.IntegerField(read_only=True)
    likes = serializers.StringRelatedField(read_only=True,many=True)
    class Meta:
        model = Post
        fields = ('id','title','desk','creator_id','likes_ct','likes')

class ChangePasswordSerializer(serializers.Serializer):
    model = get_user_model()

    """
    Serializer for password change endpoint.
    """
    old_password = serializers.CharField(required=True)
    new_password = serializers.CharField(required=True)