from django.contrib.auth.models import AbstractUser
from django.db import models
from django.utils.timezone import now 
from django.conf import settings
from django.contrib.auth import get_user_model
from django.contrib.contenttypes.fields import GenericForeignKey
from django.contrib.contenttypes.models import ContentType

class Tag(models.Model):
    name = models.CharField(max_length=100, unique=True)

    def __str__(self):
        return self.name

class UserDisabilityTag(models.Model):
    name = models.CharField(max_length=100, unique=True)

    def __str__(self):
        return self.name

class DisabilityTag(models.Model):
    name = models.CharField(max_length=100, unique=True)

    def __str__(self):
        return self.name
    
class User(AbstractUser):
    preferences = models.ManyToManyField(Tag, blank=True)
    USER_TYPES = (
        ('employee', 'Employee'),
        ('employer', 'Employer'),
    )
    user_type = models.CharField(max_length=10, choices=USER_TYPES)

    def __str__(self):
        return self.username


class EmployeeProfile(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE, primary_key=True)
    pro_headline = models.CharField(max_length=255, blank=True, null=True)
    full_name=models.CharField(max_length=100,blank=True,null=True)
    role = models.CharField(max_length=100, blank=True,null=True)
    experience = models.TextField(blank=True, null=True)
    bio = models.TextField(blank=True, null=True)
    ID_no = models.CharField(max_length=100, blank=True, null=True)
    skills = models.TextField(blank=True, null=True)  
    user_disability = models.CharField(max_length=100, blank=True, null=True)
    employee_resume = models.FileField(upload_to='resumes/', null=True, blank=True)
    user_disablitytag = models.ManyToManyField(UserDisabilityTag, blank=True)
    contact_no = models.CharField(max_length=20, blank=True, null=True)
    location = models.CharField(max_length=255, blank=True, null=True)
    activated = models.BooleanField(default=False)
    def __str__(self):
        return self.user.username


class EmployerProfile(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE, primary_key=True)
    comp_name = models.CharField(max_length=100)
    comp_desc = models.TextField(blank=True, null=True)
    comp_site = models.URLField(blank=True, null=True)
    industry = models.CharField(max_length=100, blank=True, null=True)
    contact_no = models.CharField(max_length=20, blank=True, null=True)
    location = models.CharField(max_length=255, blank=True, null=True)

    def __str__(self):
        return self.comp_name



class JobPost(models.Model):
    posted_by = models.ForeignKey(
        settings.AUTH_USER_MODEL, 
        on_delete=models.CASCADE,
        limit_choices_to={'user_type': 'Employer'},
        null=True
    )
    post_id = models.AutoField(primary_key=True)
    job_title = models.CharField(max_length=100)
    job_desc = models.TextField()
    job_type = models.CharField(max_length=50, blank=True, null=True)
    category = models.CharField(max_length=100, blank=True, null=True)
    location = models.CharField(max_length=100, blank=True, null=True)
    salary_range = models.DecimalField(max_digits=10, decimal_places=2, blank=True, null=True)
    skills_req = models.TextField(blank=True, null=True)  
    disabilitytag= models.ManyToManyField(DisabilityTag, blank=True)
    tags = models.ManyToManyField(Tag, blank=True) 
    created_at = models.DateTimeField(default=now, editable=False)

    def get_company_name(self):
        """Fetch company name from EmployerProfile if it exists."""
        employer_profile = EmployerProfile.objects.filter(user=self.posted_by).first()
        return employer_profile.comp_name if employer_profile else "Unknown Company"
    
    def get_company_location(self):
        """Fetch company name from EmployerProfile if it exists."""
        employer_profile = EmployerProfile.objects.filter(user=self.posted_by).first()
        return employer_profile.location if employer_profile else "Unknown Location"

    def __str__(self):
        return f"{self.job_title} - {self.get_company_name()} ({self.get_company_location()})"


class Application(models.Model):
    applicant = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        limit_choices_to={'user_type': 'Employee'},
        null=True)
    application_id = models.AutoField(primary_key=True)
    application_status = models.CharField(max_length=100, default="Pending")
    applicant_name = models.CharField(max_length=100)
    applicant_role = models.CharField(max_length=100)
    applicant_experience = models.TextField(blank=True, null=True)
    applicant_location = models.CharField(max_length=100, blank=True, null=True)
    application_action = models.TextField(blank=True, null=True)  
    applicant_skills = models.TextField(blank=True, null=True)  
    resume = models.CharField(max_length=100, null=True, blank=True)
    job_post = models.ForeignKey(
    JobPost, 
    on_delete=models.CASCADE, 
    related_name="applications",
    null=True,  
    
)
    
    

    def __str__(self):
        return f"{self.applicant_name} - {self.applicant_role} (Applied for {self.job_post.job_title})"
class Announcement(models.Model):
    announcement_id = models.AutoField(primary_key=True)
    title = models.CharField(max_length=100)
    message = models.TextField()
    action = models.CharField(max_length=100, blank=True, null=True)
    location = models.CharField(max_length=100, blank=True, null=True)

    def __str__(self):
        return self.title


#START OF FORUMS MODELS
#------------------------------------------------------------------------------
class Post(models.Model):
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name="posts")
    title = models.CharField(max_length=255)
    content = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.title

class Comment(models.Model):
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name="comments")
    post = models.ForeignKey(Post, on_delete=models.CASCADE, related_name="comments")
    parent = models.ForeignKey('self', null=True, blank=True, on_delete=models.CASCADE, related_name="replies")
    content = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Comment by {self.user.username} on {self.post.title}"

class Report(models.Model):
    reported_by = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name="reports")
    post = models.ForeignKey(Post, on_delete=models.CASCADE, related_name="reports", null=True, blank=True)
    comment = models.ForeignKey(Comment, on_delete=models.CASCADE, related_name="reports", null=True, blank=True)
    reason = models.TextField()
    report_desc = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        if self.post:
            return f"Report by {self.reported_by.username} on Post {self.post.id}"
        elif self.comment:
            return f"Report by {self.reported_by.username} on Comment {self.comment.id}"
        return f"Report by {self.reported_by.username}"


class BannedWord(models.Model):
    word = models.CharField(max_length=50, unique=True)

    def __str__(self):
        return self.word
    
# START NG NOTIFS MODEL



User = get_user_model()

class Notification(models.Model):
    recipient = models.ForeignKey(User, on_delete=models.CASCADE, related_name="notifications")
    title = models.CharField(max_length=255) 
    action = models.CharField(max_length=255)  
    
   
    target_content_type = models.ForeignKey(
        ContentType, on_delete=models.SET_NULL, null=True, blank=True
    )
    target_object_id = models.PositiveIntegerField(null=True, blank=True)
    target = GenericForeignKey("target_content_type", "target_object_id")

    is_read = models.BooleanField(default=False)
    timestamp = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ["-timestamp"]  

    def __str__(self):
        return f"{self.recipient} - {self.title} ({self.action})"
    
# END NG NOTIFS MODEL


#START NG CHAT MODEL



User = get_user_model()

class ChatRooms(models.Model):
    employee = models.ForeignKey(User, related_name="employee_chats", on_delete=models.CASCADE)
    employer = models.ForeignKey(User, related_name="employer_chats", on_delete=models.CASCADE)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Chat between {self.employee.username} and {self.employer.username}"

class Messages(models.Model):
    room = models.ForeignKey(ChatRooms, related_name="messages", on_delete=models.CASCADE)
    sender = models.ForeignKey(User, on_delete=models.CASCADE)
    content = models.TextField()
    timestamp = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Messages from {self.sender.username}"