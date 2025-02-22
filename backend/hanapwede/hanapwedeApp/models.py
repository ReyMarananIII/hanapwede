from django.contrib.auth.models import AbstractUser
from django.db import models
from django.utils.timezone import now 
from django.conf import settings

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
    bio = models.TextField(blank=True, null=True)
    user_disablitytag = models.ManyToManyField(UserDisabilityTag, blank=True)
    contact_no = models.CharField(max_length=20, blank=True, null=True)
    location = models.CharField(max_length=255, blank=True, null=True)

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
    application_id = models.AutoField(primary_key=True)
    applicant_name = models.CharField(max_length=100)
    applicant_role = models.CharField(max_length=100)
    applicant_experience = models.TextField(blank=True, null=True)
    applicant_location = models.CharField(max_length=100, blank=True, null=True)
    application_action = models.TextField(blank=True, null=True)  
    applicant_skills = models.TextField(blank=True, null=True)  
    resume = models.FileField(upload_to='resumes/', null=True, blank=True)
    job_post = models.ForeignKey(
    JobPost, 
    on_delete=models.CASCADE, 
    related_name="applications",
    null=True,  # Temporary to allow migration
    
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
