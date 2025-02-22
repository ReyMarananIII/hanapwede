from rest_framework import serializers
from .models import EmployerProfile, JobPost,Tag ,User as CustomUser, DisabilityTag,Application

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