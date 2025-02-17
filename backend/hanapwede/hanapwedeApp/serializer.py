from rest_framework import serializers
from .models import EmployerProfile, JobPost,Tag ,User as CustomUser

class EmployerProfileSerializer(serializers.ModelSerializer):
    class Meta:
        model = EmployerProfile
        fields = ["comp_name", "comp_desc", "comp_site", "industry", "contact_no", "location"]



class JobPostSerializer(serializers.ModelSerializer):
    class Meta:
        model = JobPost
        fields = "__all__"

class TagSerializer(serializers.ModelSerializer):
    class Meta:
        model = Tag
        fields = '__all__'

class UserPreferenceSerializer(serializers.ModelSerializer):
    preferences = TagSerializer(many=True)

    class Meta:
        model = CustomUser
        fields = ['id', 'username', 'preferences']