"""
URL configuration for hanapwede project.

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/5.1/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
from django.contrib import admin
from django.urls import path
from hanapwedeApp.views import signup, login_view,logout_view,employer_profile,post_job, get_tags,save_preferences,recommend_jobs, get_user_preferences
from hanapwedeApp.views import get_disability_tags,get_job,apply_job,employer_dashboard
from django.urls import path, include
from rest_framework.routers import DefaultRouter
from hanapwedeApp.views import PostViewSet, CommentViewSet, ReportViewSet, BannedWordViewSet
from hanapwedeApp.views import edit_profile,get_notifications,mark_notification_read,mark_all_notifications_read
from hanapwedeApp.views import get_chat_messages, create_chat,send_message,get_user_chats,get_user_details
from hanapwedeApp.views import get_pending_users,approve_user,reject_user,get_preferences
router = DefaultRouter()
router.register(r'posts', PostViewSet)
router.register(r'comments', CommentViewSet)
router.register(r'reports', ReportViewSet)
router.register(r'banned-words', BannedWordViewSet)

urlpatterns = [
    path('api/', include(router.urls)),
    path('admin/', admin.site.urls),
    path('api/signup/', signup, name='signup'),
    path("api/login/", login_view, name="login"),
    path("api/logout/", logout_view, name="logout"),
    path("api/employer-profile/", employer_profile, name="employer-profile"),
    path("api/post-job/", post_job, name="post-job"),
    path("api/tags/", get_tags, name="get_tags"),
    path("api/save-preferences/", save_preferences, name="save_preferences"),
    path("api/recommend_jobs/", recommend_jobs, name="recommend_jobs"),
    path('api/user-preferences/<int:user_id>/', get_user_preferences, name='user-preferences'),
    path('api/disability-tags/', get_disability_tags, name='get-disability-tags'),
    path("api/job/<int:post_id>/", get_job, name="get_job"),
    path("api/submit-application/", apply_job, name="apply_job"),
    path("api/employer-dashboard/", employer_dashboard, name="employer-dashboard"),
    path("api/edit-profile/", edit_profile,name="edit_profile"),
    path("api/get-notifications/",get_notifications,name="get_notifications"),
    path("api/mark-notification-read/<int:notification_id>/", mark_notification_read, name="mark-notification-read"),
    path("api/mark-all-notifications-read/", mark_all_notifications_read, name="mark-all-notifications-read"),
    path('chat/messages/<int:room_id>/', get_chat_messages, name='get_chat_messages'),
    path('api/create_chat/', create_chat, name='create_chat'),   
    path("api/send_message/", send_message, name="send_message"),
    path("api/user-chats/", get_user_chats, name="get_user_chats"),
    path("api/get-user-details/<int:user_id>/", get_user_details, name="get_user_details"),
    path("api/admin/pending-users/",get_pending_users,name="get_pending_users"),
    path("api/admin/approve-user/<int:id>/",approve_user,name="approve_user"),
    path("api/admin/reject-user/<int:id>/",reject_user,name="reject_user"),
    path("api/preferences/", get_preferences, name="get_preferences"),


]
