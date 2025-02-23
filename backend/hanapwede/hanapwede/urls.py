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


]
