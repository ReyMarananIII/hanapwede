from django.contrib import admin
from .models import JobPost, Tag, User, EmployeeProfile,EmployerProfile,DisabilityTag,UserDisabilityTag 
from .models import Post, Comment, Report, BannedWord
admin.site.register(JobPost)
admin.site.register(Tag)
admin.site.register(User)
admin.site.register(EmployerProfile)
admin.site.register(EmployeeProfile)
admin.site.register(DisabilityTag)
admin.site.register(UserDisabilityTag)
admin.site.register(Post)
admin.site.register(Comment)
admin.site.register(Report)
admin.site.register(BannedWord)