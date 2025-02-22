from django.contrib import admin
from .models import JobPost, Tag, User, EmployeeProfile,EmployerProfile,DisabilityTag,UserDisabilityTag 

admin.site.register(JobPost)
admin.site.register(Tag)
admin.site.register(User)
admin.site.register(EmployerProfile)
admin.site.register(EmployeeProfile)
admin.site.register(DisabilityTag)
admin.site.register(UserDisabilityTag)
