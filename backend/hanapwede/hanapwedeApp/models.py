from django.contrib.auth.models import AbstractUser
from django.db import models

class User(AbstractUser):  # Custom user model
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
    disability_type = models.CharField(max_length=100, blank=True, null=True)
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




class Application(models.Model):
    application_id = models.AutoField(primary_key=True)
    applicant_name = models.CharField(max_length=100)
    applicant_role = models.CharField(max_length=100)
    applicant_experience = models.TextField(blank=True, null=True)
    applicant_location = models.CharField(max_length=100, blank=True, null=True)
    application_action = models.TextField(blank=True, null=True)  
    skills_req = models.TextField(blank=True, null=True)  # Store CSV skills as a string

    def __str__(self):
        return f"{self.applicant_name} - {self.applicant_role}"


class JobPost(models.Model):
    post_id = models.AutoField(primary_key=True)
    job_title = models.CharField(max_length=100)
    job_desc = models.TextField()
    job_type = models.CharField(max_length=50, blank=True, null=True)
    category = models.CharField(max_length=100, blank=True, null=True)
    location = models.CharField(max_length=100, blank=True, null=True)
    salary_range = models.CharField(max_length=50, blank=True, null=True)
    skills_req = models.TextField(blank=True, null=True)  # Store CSV skills as a string

    def __str__(self):
        return self.job_title


class Announcement(models.Model):
    announcement_id = models.AutoField(primary_key=True)
    title = models.CharField(max_length=100)
    message = models.TextField()
    action = models.CharField(max_length=100, blank=True, null=True)
    location = models.CharField(max_length=100, blank=True, null=True)

    def __str__(self):
        return self.title
