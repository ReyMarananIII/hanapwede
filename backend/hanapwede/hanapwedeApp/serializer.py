from rest_framework import serializers
from .models import EmployerProfile, JobPost,Tag ,User as CustomUser, DisabilityTag,Application
from .models import Post,Comment, Report,BannedWord

class EmployerProfileSerializer(serializers.ModelSerializer):
    class Meta:
        model = EmployerProfile
        fields = ["comp_name", "comp_desc", "comp_site", "industry", "contact_no", "location"]



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
    class Meta:
        model = Application
        fields = '__all__'


#start of forums serializers
class PostSerializer(serializers.ModelSerializer):
    user = serializers.CharField(source="user.first_name", read_only=True)
    comment_count = serializers.SerializerMethodField()  # Include comment count

    class Meta:
        model = Post
        fields = '__all__'  # Includes comment_count

    def get_comment_count(self, obj):
        return obj.comments.count()

class CommentSerializer(serializers.ModelSerializer):
    user = serializers.CharField(source="user.first_name", read_only=True)
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