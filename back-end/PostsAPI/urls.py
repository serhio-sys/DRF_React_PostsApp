from django.urls import path,include
from rest_framework_simplejwt.views import (
    TokenRefreshView,
    TokenVerifyView,
    TokenBlacklistView
)
from .views import PostAPIViewSet,DestroyPost,DestroyAccount,UserAPIViewSet,PostAPIPatch,UserAPIPatch,UsersFollowersView,UsersFollowedView,createuser,MyTokenObtainView,PostsFilteredView,livesearch,follow,getfollowers

urlpatterns = [
    path('token/', MyTokenObtainView.as_view(), name='token_obtain_pair'),
    path('token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('token/verify/', TokenVerifyView.as_view(), name='token_verify'),
    path('logout/', TokenBlacklistView.as_view(), name='token_blacklist'),
    path('users/',UserAPIViewSet.as_view({'get':'list'})),
    path('users/<pk>/',UserAPIViewSet.as_view({'get':'retrieve'})),
    path('create-users/',createuser),
    path('users/<pk>/follow/',follow),
    path('users/<pk>/followers/',UsersFollowersView.as_view()),
    path('users/<pk>/followed/',UsersFollowedView.as_view()),
    path('followed/<pk>/',getfollowers),
    path('users/<pk>/patch/',UserAPIPatch.as_view()),
    path('search-users/',livesearch),
    path('delete-post/<pk>/',DestroyPost.as_view()),
    path('delete-user/<pk>/',DestroyAccount.as_view()),
    path('posts/',PostAPIViewSet.as_view({'get':'list','post':'createpost'})),
    path('posts/<pk>/filter/',PostsFilteredView.as_view()),
    path('posts/<pk>/',PostAPIViewSet.as_view({'get':'retrieve'})),
    path('posts/<pk>/like/',PostAPIViewSet.as_view({'post':'likeunlikepost'})),
    path('posts/<pk>/patch/',PostAPIPatch.as_view()),
    path('password_reset/', include('django_rest_passwordreset.urls', namespace='password_reset')),
]
