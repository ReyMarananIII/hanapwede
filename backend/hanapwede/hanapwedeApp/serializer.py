from rest_framework import serializers
from .models import EmployerProfile

class EmployerProfileSerializer(serializers.ModelSerializer):
    class Meta:
        model = EmployerProfile
        fields = ["comp_name", "comp_desc", "comp_site", "industry", "contact_no", "location"]
