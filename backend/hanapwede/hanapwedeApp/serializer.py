from rest_framework import serializers
from .models import EmployerProfile, JobPost,Tag ,User as CustomUser, DisabilityTag,Application
from .models import Post,Comment, Report,BannedWord, EmployeeProfile,Notification
from rest_framework import serializers
from .models import JobFair, JobPost, JobFairRegistration,PWDCard

class EmployerProfileSerializer(serializers.ModelSerializer):
    class Meta:
        model = EmployerProfile
        fields = ["comp_name", "comp_desc", "comp_site", "industry", "contact_no", "location","user_id"]



class JobPostSerializer(serializers.ModelSerializer):
    disabilitytag = serializers.PrimaryKeyRelatedField(
        queryset=DisabilityTag.objects.all(), many=True, required=False
    )
    salary_range = serializers.DecimalField(max_digits=10, decimal_places=2)  # If salary is numeric
   

    class Meta:
        model = JobPost
        fields = "__all__"
        extra_kwargs = {'posted_by': {'read_only': True}}

class TagSerializer(serializers.ModelSerializer):
    class Meta:
        model = Tag
        fields = '__all__'



class UserPreferenceSerializer(serializers.ModelSerializer):
    preferences = TagSerializer(many=True)

    class Meta:
        model = CustomUser
        fields = ['id', 'username', 'preferences']

class DisabilityTagSerializer(serializers.ModelSerializer):
    class Meta:
        model = DisabilityTag
        fields = '__all__'

class JobApplicationSerializer(serializers.ModelSerializer):
    applicant_id = serializers.PrimaryKeyRelatedField(source='applicant.id', read_only=True)
    job_title = serializers.PrimaryKeyRelatedField(source='job_post.job_title', read_only=True)
    class Meta:
        model = Application
        fields = '__all__'





#start of forums serializers
class PostSerializer(serializers.ModelSerializer):
    username = serializers.CharField(source="user.first_name", read_only=True)
    comment_count = serializers.SerializerMethodField()  # Include comment count

    class Meta:
        model = Post
        fields = '__all__'  # Includes comment_count

    def get_comment_count(self, obj):
        return obj.comments.count()

class CommentSerializer(serializers.ModelSerializer):
    username = serializers.CharField(source="user.first_name", read_only=True)
    replies = serializers.SerializerMethodField()

    class Meta:
        model = Comment
        fields = '__all__'

    def get_replies(self, obj):
        return CommentSerializer(obj.replies.all(), many=True).data

class ReportSerializer(serializers.ModelSerializer):
    class Meta:
        model = Report
        fields = '__all__'

    def validate(self, data):
        if not data.get("post") and not data.get("comment"):
            raise serializers.ValidationError("You must report either a post or a comment.")
        if data.get("post") and data.get("comment"):
            raise serializers.ValidationError("You cannot report both a post and a comment in one request.")
        return data

class BannedWordSerializer(serializers.ModelSerializer):
    class Meta:
        model = BannedWord
        fields = '__all__'

class EmployeeProfileSerializer(serializers.ModelSerializer):
    username = serializers.CharField(source="user.username", read_only=True)
  
    class Meta:
        model= EmployeeProfile
        fields = [ 
            'username',
            'user',
            'pro_headline',
            'full_name',
            'role',
            'experience',
            'bio',
            'ID_no',
            'skills',
            'user_disability',
            'employee_resume',
            'user_disablitytag',
            'contact_no',
            'location',
            'activated',
        ]
class UserSerializer(serializers.ModelSerializer):
    employeeprofile = EmployeeProfileSerializer(read_only=True)
    class Meta:
        model = CustomUser
        fields = ['id', 'username', 'first_name','last_name', 'email', 'user_type', 'profile_picture', 'employeeprofile']




class NotificationSerializer(serializers.ModelSerializer):
    class Meta:
        model=Notification
        fields = ['id', 'title', 'action', 'is_read', 'timestamp']

class JobApplicationSerializerv2(serializers.ModelSerializer):
    job_title = serializers.CharField(source="job_post.job_title", read_only=True)
    company_name = serializers.CharField(source="job_post.posted_by.employerprofile.comp_name", read_only=True)
    job_type = serializers.CharField(source="job_post.job_type", read_only=True)
    location = serializers.CharField(source="job_post.location", read_only=True)
    posted_by_id = serializers.IntegerField(source="job_post.posted_by.id", read_only=True)

    class Meta:
        model = Application
        fields = [
            "application_id", 
            "job_title", 
            "company_name", 
            "application_status", 
            "job_type", 
            "location", 
            "posted_by_id",  # Include Employer's User ID
        ]


class ReportSerializerv2(serializers.ModelSerializer):
    reported_by_username = serializers.CharField(source="reported_by.username", read_only=True)
    post_content = serializers.CharField(source="post.content", read_only=True)
    comment_content = serializers.CharField(source="comment.content", read_only=True)
    post_author = serializers.CharField(source="post.user.username", read_only=True)
    comment_author = serializers.CharField(source="comment.user.username", read_only=True)

    class Meta:
        model = Report
        fields = [
            "id",
            "reported_by",
            "reported_by_username",
            "post",
            "post_content",
            "comment",
            "comment_content",
            "post_author",
            "comment_author",
            "reason",
            "report_desc",
            "created_at"
        ]

#job fair serializer


class JobFairSerializer(serializers.ModelSerializer):
    jobs = serializers.PrimaryKeyRelatedField(queryset=JobPost.objects.all(), many=True)
    registrations_count = serializers.SerializerMethodField()
    jobs_count = serializers.SerializerMethodField()

    class Meta:
        model = JobFair
        fields = ['id', 'title', 'description', 'date', 'contact_number', 'email', 'jobs', 'registrations_count', 'jobs_count']
        read_only_fields = ['organizer']

    def get_registrations_count(self, obj):
        # Count the number of registrations for this job fair
        return JobFairRegistration.objects.filter(job_fair=obj).count()

    def get_jobs_count(self, obj):
        # Count the number of jobs associated with this job fair
        return obj.jobs.count()


class JobFairRegistrationSerializer(serializers.ModelSerializer):
    user = UserSerializer(read_only=True)
    class Meta:
        model = JobFairRegistration
        fields = ['id','job_fair','user','registered_at']


class PWDCardSerializer(serializers.ModelSerializer):
    class Meta:
        model = PWDCard
        fields = ['id', 'user', 'image', 'uploaded_at']
    
