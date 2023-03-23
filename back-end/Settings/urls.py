from rest_framework import routers
from django.contrib import admin
from django.urls import path,include

router = routers.DefaultRouter().urls

urlpatterns = router

urlpatterns += [
    path('admin/', admin.site.urls),
    path('api/',include("PostsAPI.urls"))
]
