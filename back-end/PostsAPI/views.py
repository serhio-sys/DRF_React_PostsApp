from django.shortcuts import get_object_or_404
from rest_framework.response import Response
from rest_framework import status
from rest_framework.viewsets import *
from .serializers import *
from .models import Post,get_user_model
from rest_framework.decorators import action,api_view,permission_classes
from rest_framework.permissions import IsAuthenticatedOrReadOnly,IsAuthenticated
from .permissions import IsAuthor,IsRegisteredUser,IsMyAcc
from django.contrib.auth.hashers import make_password
from rest_framework_simplejwt.views import TokenObtainPairView
from .paginatiors import PostPaginator,UserPaginator
from django.dispatch import receiver
from django_rest_passwordreset.signals import reset_password_token_created
from django.core.mail import EmailMultiAlternatives
from rest_framework.views import APIView
from django.template.loader import render_to_string
from django.utils.html import strip_tags
import re
from rest_framework.generics import DestroyAPIView
from rest_framework.pagination import LimitOffsetPagination
from django.core.exceptions import ObjectDoesNotExist

class MyTokenObtainView(TokenObtainPairView):
    serializer_class = MyTokenObtainSerializer

class DestroyPost(DestroyAPIView):
    serializer_class = PostSerializer
    permission_classes = [IsAuthor,]
    queryset = Post.objects.all()

class DestroyAccount(DestroyAPIView):
    serializer_class = UserSerializer
    permission_classes = [IsMyAcc,]
    queryset = get_user_model().objects.all()

@api_view(['get'])
def get_user_by_name(request,name):
    try:
        user = get_user_model().objects.get(username=name)
    except get_user_model().DoesNotExist:
        return Response({"error":"Does not exist!"},status=status.HTTP_400_BAD_REQUEST)
    return Response(UserSerializer(user).data,status=status.HTTP_200_OK)

@api_view(['get'])
@permission_classes([IsAuthenticated,])
def check_or_create_chat(request,pk):
    print(request.user.pk,pk)
    if request.user.pk==int(pk):
        return Response({"error":"Request user is same with another user!"},status=status.HTTP_400_BAD_REQUEST)
    try:
        get_user_model().objects.get(pk=pk)
    except get_user_model().DoesNotExist or ObjectDoesNotExist:
        return Response({"error":"User is not found!"},status=status.HTTP_400_BAD_REQUEST)
    try:
        chat = Chat.objects.filter(users__in=[request.user.pk,pk])
        print(chat[0].id)
    except IndexError:
        chat = Chat.objects.create()
        chat.users.add(request.user)
        chat.users.add(get_user_model().objects.get(pk=pk))
        chat.save()
        return Response({"chat":ChatSerializer(chat).data},status=status.HTTP_200_OK)
    messages = Message.objects.filter(chat__id=chat[0].id)
    return Response({"chat":ChatSerializer(chat[0]).data,"messages":MessageSerializer(messages,many=True).data},status=status.HTTP_200_OK)


@api_view(['post'])
@permission_classes([IsAuthenticated,])
def follow(request,pk):
    if pk == request.user.pk:
        return Response({"error":"You can`t follow you!"},status=status.HTTP_400_BAD_REQUEST)
    user_f = get_object_or_404(get_user_model(),pk=pk)
    if user_f.followers.filter(pk=request.user.pk).exists():
        user_f.followers.remove(request.user)
        user_f.followers_ct -= 1
        user_f.save()
        return Response({False},status=status.HTTP_200_OK)
    else:
        user_f.followers.add(request.user)
        user_f.followers_ct += 1
        user_f.save()
        return Response({True},status=status.HTTP_200_OK)
    

@api_view(['get'])
def getfollowers(request,pk):
    followed =get_object_or_404(get_user_model(),pk=pk).followers_l.all()
    return Response({"followed":len(followed)},status=status.HTTP_200_OK)


class UsersFollowersView(APIView,LimitOffsetPagination):
    def get(self,request,pk):
        users = get_object_or_404(get_user_model(),pk=pk).followers.all()
        result = self.paginate_queryset(users,request,self)
        serializer = UserSerializer(result,many=True)
        return self.get_paginated_response(serializer.data)
    
class UsersFollowedView(APIView,LimitOffsetPagination):
    def get(self,request,pk):
        users = get_object_or_404(get_user_model(),pk=pk).followers_l.all()
        result = self.paginate_queryset(users,request,self)
        serializer = UserSerializer(result,many=True)
        return self.get_paginated_response(serializer.data)

class UserAPIViewSet(mixins.RetrieveModelMixin,
                   mixins.ListModelMixin,
                   GenericViewSet):
    pagination_class = UserPaginator
    queryset = get_user_model().objects.all()
    serializer_class = UserSerializer

@api_view(['post'])
def livesearch(request):
    user_list = get_user_model().objects.all()
    new_list = []
    for user in user_list:
        if request.data['username'] in user.username:
            new_list.append(user)
    serializer = UserSerializer(new_list,many=True)
    return Response({'users':serializer.data},status=status.HTTP_200_OK)


@api_view(["post"])
def createuser(request):
    user = UserCreationSerializer(data=request.data)
    pattern_password = re.compile(r'^(?=.*[0-9].*)(?=.*[a-z].*)(?=.*[A-Z].*)[0-9a-zA-Z]{8,}$')
    try:
        get_user_model().objects.get(email=request.data['email'])
        get_user_model().objects.get(username=request.data['username'])
        return Response({"error":"This account is exists!"},status=status.HTTP_400_BAD_REQUEST)
    except get_user_model().DoesNotExist:
        pass
    if not bool(pattern_password.match(request.data['password'])):
        return Response({"error":"Very weak password!"},status=status.HTTP_400_BAD_REQUEST)
    if len(request.data['username'])<8:
        return Response({"error":"Username must be not less then 8!"},status=status.HTTP_400_BAD_REQUEST)
    if not request.data['password']==request.data['password1']:
        return Response({"error":"Passwords is not equal!"},status=status.HTTP_400_BAD_REQUEST)
    if user.is_valid():
        get_user_model().objects.create(username=user.data['username'],email=user.data['email'],password=make_password(user.data['password']))
        return Response({"success":"Account created successfully!"},status=status.HTTP_201_CREATED)
    return Response({"error":"Creating error!"},status=status.HTTP_400_BAD_REQUEST)

class PostAPIViewSet(mixins.RetrieveModelMixin,
                   mixins.ListModelMixin,
                   GenericViewSet):
    permission_classes=[IsAuthenticatedOrReadOnly,]
    serializer_class = PostSerializer
    queryset = Post.objects.all()
    pagination_class = PostPaginator

    @action(methods=['post'],detail=True)
    def likeunlikepost(self,request,pk):
        post = get_object_or_404(Post,pk=pk)
        if post.likes.filter(pk=request.user.pk).exists():
            post.likes.remove(request.user)
            post.likes_ct -= 1
            post.save()
            return Response({False},status=status.HTTP_200_OK)
        else:
            post.likes.add(request.user)
            post.likes_ct += 1
            post.save()
            return Response({True},status=status.HTTP_200_OK)
        


    @action(methods=['post'],detail=False)
    def createpost(self,request,*args, **kwargs):
        if len(request.data['title'])>=6 and len(request.data['desk'])>=8:
            Post.objects.create(
                title = request.data['title'],
                desk = request.data['desk'],
                creator = request.user
            )
            return Response({"success":"Successful created!"}, status=status.HTTP_201_CREATED)
        return Response({"detail":"Error in creating post"},status=status.HTTP_400_BAD_REQUEST)


class PostsFilteredView(APIView,LimitOffsetPagination):

    def get(self,request,pk):
        posts = Post.objects.filter(creator=pk)
        result = self.paginate_queryset(posts,request,self)
        serializer = PostSerializer(result,many=True)
        return self.get_paginated_response(serializer.data)
    

class PostAPIPatch(generics.RetrieveUpdateDestroyAPIView):
    permission_classes = (IsAuthor,)
    serializer_class = PostSerializer
    queryset = Post.objects.all()

class UserAPIPatch(generics.RetrieveUpdateDestroyAPIView):
    permission_classes = (IsRegisteredUser,)
    serializer_class = UserSerializer
    queryset = get_user_model().objects.all()


@receiver(reset_password_token_created)
def password_reset_token_created(sender, instance, reset_password_token, *args, **kwargs):

    link = "http://localhost:3000/reset-password/{}/".format(reset_password_token.key)
    subject, from_email, to = 'POST APP Reset Password', 'ggdropcompany@gmail.com', reset_password_token.user.email
    
    html_content = render_to_string('mail.html', {'user':reset_password_token.user.username,"link":link}) # render with dynamic value
    text_content = strip_tags(html_content) # Strip the html tag. So people can see the pure text at least.
    msg = EmailMultiAlternatives(subject, text_content, from_email, [to])
    msg.attach_alternative(html_content, "text/html")
    msg.send()

