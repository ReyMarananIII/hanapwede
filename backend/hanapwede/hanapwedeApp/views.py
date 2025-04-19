from django.views.decorators.csrf import csrf_exempt
from django.contrib.auth import get_user_model
from django.shortcuts import get_object_or_404
from django.contrib.auth.hashers import make_password
from django.contrib.contenttypes.models import ContentType
from django.db.models import Count
from hanapwedeApp.models import EmployeeProfile,Notification , JobFairJobPost
import json
from django.contrib.auth import authenticate
from rest_framework.authtoken.models import Token
from django.contrib.auth import logout
from django.http import JsonResponse
from rest_framework import status, serializers
from rest_framework.response import Response
from rest_framework.decorators import api_view, permission_classes,parser_classes,authentication_classes
from rest_framework.permissions import IsAuthenticated
from .models import EmployerProfile, Post, Comment, Report, BannedWord
from .serializer import EmployerProfileSerializer
from .serializer import JobPostSerializer, ReportSerializerv2,PWDCardSerializer
from .models import Tag, User, JobPost, DisabilityTag,Application
from .serializer import TagSerializer, DisabilityTagSerializer,JobApplicationSerializer
import pandas as pd
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity
from rest_framework.parsers import MultiPartParser, FormParser
from rest_framework.authentication import TokenAuthentication
from rest_framework import viewsets
from hanapwedeApp.models import ChatRooms , Messages, Application, JobFairRegistration
from rest_framework import viewsets
from rest_framework.permissions import IsAuthenticated
from .models import JobFair,PWDCard
from .serializer import JobFairSerializer

from .serializer import PostSerializer, CommentSerializer, ReportSerializer, BannedWordSerializer
from .serializer import EmployeeProfileSerializer,NotificationSerializer,UserSerializer, JobApplicationSerializerv2, JobFairRegistrationSerializer
from rest_framework.views import APIView

#forgot password imports 
from django.core.mail import send_mail
from django.http import JsonResponse
from django.shortcuts import render
from django.contrib.auth.tokens import default_token_generator
from django.utils.http import urlsafe_base64_encode, urlsafe_base64_decode
from django.contrib.auth import get_user_model
from django.template.loader import render_to_string
from django.contrib.sites.shortcuts import get_current_site
from django.conf import settings
import json
from django.utils.translation import gettext_lazy as _
from django.contrib.auth.tokens import PasswordResetTokenGenerator

#end



#OCR imports

import easyocr
from PIL import Image
import numpy as np
from django.http import JsonResponse

from .tokens import email_verification_token




from django.core.mail import send_mail
from django.urls import reverse
from django.utils.http import urlsafe_base64_encode
from django.utils.encoding import force_bytes
from django.contrib.auth import get_user_model
from django.utils.http import urlsafe_base64_decode
from django.shortcuts import redirect
from django.contrib import messages
from .tokens import email_verification_token
User = get_user_model()


def verify_email(request, uidb64, token):
    try:
        uid = urlsafe_base64_decode(uidb64).decode()
        user = User.objects.get(pk=uid)
    except (TypeError, ValueError, OverflowError, User.DoesNotExist):
        user = None

    if user and email_verification_token.check_token(user, token):
        user.is_email_verified = True
        user.save()
        messages.success(request, "Email verified successfully.")
    else:
        messages.error(request, "Invalid or expired verification link.")
    frontend_url = "https://hanapwede.com" #papaltan to
    return redirect(f"{frontend_url}/")
@csrf_exempt
def signup(request):
    if request.method == "POST":
        try:
            data = json.loads(request.body)
            first_name = data.get("first_name")
            last_name = data.get("last_name")
            email = data.get("email")
            password = data.get("password")
            user_type = data.get("user_type")
            
            user_disability = data.get("user_disability")
            ID_number = data.get("ID_number")   

            if not all([first_name, last_name, email, password]):
                return JsonResponse({"error": "All fields are required."}, status=400)

            if User.objects.filter(email=email).exists():
                return JsonResponse({"error": "Email is already registered."}, status=400)

            user = User.objects.create(
                username=email,
                email=email,
                first_name=first_name,
                last_name=last_name,
                password=make_password(password),
                user_type=user_type,
            )

            if user_type == "Employee":
                EmployeeProfile.objects.create(
                    user_id=user.id,
                    user_disability=user_disability,
                    ID_no=ID_number
                )


            uid = urlsafe_base64_encode(force_bytes(user.pk))
            token = email_verification_token.make_token(user)
            verification_link = request.build_absolute_uri(
                reverse('verify_email', kwargs={'uidb64': uid, 'token': token})
            )

            send_mail(
                subject='Verify your Hanapwede email',
                message= f"Hi {user.first_name},\n\n""Thank you for registering with Hanapwede!\n\n"f"To complete your registration, please verify your email by clicking the link below:\n"f"{verification_link}\n\n""If you did not sign up for this account, please ignore this email.\n\n""Best regards,\n""Hanapwede Team",
                from_email='noreply@hanapwede.com',
                recipient_list=[user.email],
                fail_silently=False,
            )

            return JsonResponse({
                "message": "User created successfully. Please check your email to verify your account.",
                "id": user.id
            }, status=201)

        except json.JSONDecodeError:
            return JsonResponse({"error": "Invalid JSON data."}, status=400)
        
@api_view(["POST"])
def admin_login(request):
    email = request.data.get("email")
    
    password = request.data.get("password")

    try:
        user = User.objects.get(email=email)
    except User.DoesNotExist:
        return JsonResponse({"error": "Invalid credentials."}, status=400)

    user = authenticate(username=user.username, password=password) 
    if user is None:
        return JsonResponse({"error": "Invalid credentials."}, status=400)


    if user.user_type != "Admin":
        return JsonResponse({"error": "Unauthorized. Only admins can access this endpoint."}, status=403)


    token, _ = Token.objects.get_or_create(user=user)

    return JsonResponse({
        "token": token.key,
        "message": "Login successful.",
        "user_type": user.user_type,
        "userId": user.id,
        "username": user.username
    }, status=200)
@api_view(["POST"])
def login_view(request):
    email = request.data.get("email")
    password = request.data.get("password")

    try:
        user = User.objects.get(email=email)
    except User.DoesNotExist:
        return JsonResponse({"error": "Invalid credentials."}, status=400)

    user = authenticate(username=user.username, password=password)

    if not user.is_email_verified:
        return JsonResponse({"error": "Please check your inbox and verify your email to continue."}, status=400)
   
    has_profile=False
    if user.user_type == "Employer":
        profile = EmployerProfile.objects.filter(user_id=user.id).first()
       
        if profile:
            has_profile=True
    elif user.user_type == "Employee":
        profile = EmployeeProfile.objects.filter(user_id=user.id).first()
    
        if not profile.activated:
            return JsonResponse({"error": "Registration Pending Admin Approval"}, status=400)
        
    if user is not None:
        token, _ = Token.objects.get_or_create(user=user)
       
        return JsonResponse({"token": token.key, "message": "Login successful.","user_type":user.user_type,'userId':user.id,'username':user.username,'has_profile':has_profile}, status=200)
    else:
        return JsonResponse({"error": "Invalid credentials."}, status=400)
    
@csrf_exempt
def logout_view(request):
    if request.method == "POST":
        logout(request)
        return JsonResponse({"message": "Successfully logged out"}, status=200)
    return JsonResponse({"error": "Invalid request"}, status=400)

@api_view(["POST"])
@permission_classes([IsAuthenticated])
def employer_profile(request):   
    user = request.user
    
    if user.user_type != "Employer":
        return Response({"error": "Unauthorized. Only employers can update their profile."}, status=status.HTTP_403_FORBIDDEN)

    profile, created = EmployerProfile.objects.get_or_create(user=user)

    serializer = EmployerProfileSerializer(profile, data=request.data, partial=True) 
    if serializer.is_valid():
        serializer.save()
        return Response({"message": "Profile updated successfully!", "data": serializer.data}, status=status.HTTP_200_OK)

    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@api_view(["POST"])
def post_job(request):
  

    
    if not request.user.is_authenticated:
        return Response({"error": "User is not authenticated"}, status=status.HTTP_401_UNAUTHORIZED)

   

    serializer = JobPostSerializer(data=request.data)

    if serializer.is_valid():
        try:
            job_post = serializer.save(posted_by=request.user)
       

        
            disability_tags = request.data.get('disabilitytag', [])
            if disability_tags:
                tags = DisabilityTag.objects.filter(id__in=disability_tags)
                if not tags.exists():
                    return Response({"error": "Invalid disability tags provided"}, status=status.HTTP_400_BAD_REQUEST)
                job_post.disabilitytag.set(tags)
        

            return Response(JobPostSerializer(job_post).data, status=status.HTTP_201_CREATED)

        except Exception as e:
          
            return Response({"error": f"Error while saving job post: {str(e)}"}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

  
    return Response({"error": "Invalid data", "details": serializer.errors}, status=status.HTTP_400_BAD_REQUEST)


@api_view(['GET'])
def get_tags(request):
    tags = Tag.objects.all()
    serializer = TagSerializer(tags, many=True)
    return Response(serializer.data)

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def save_preferences(request):
    user = request.user
    tag_ids = request.data.get('tags', []) 
    user.preferences.set(Tag.objects.filter(id__in=tag_ids))
    if user.user_type == "Employer":
        profile = EmployerProfile.objects.filter(user_id=user.id).first()
        has_profile = profile is not None

    else:
        has_profile = False
    return Response({"message": "Preferences saved successfully","has_profile":has_profile}, status=200)





@api_view(['PUT'])
@permission_classes([IsAuthenticated])
def edit_profile(request):
    id = request.user.id
    user = User.objects.get(id=id)
    profile_picture = request.FILES.get('profile_picture')
    print(user)
    print("profile",profile_picture)
    user_serializer = UserSerializer(user,data=request.data,partial=True)
    if profile_picture:
        user.profile_picture = profile_picture
    if user_serializer.is_valid():
        user_serializer.save()

    try:
        user_profile = EmployeeProfile.objects.get(user_id=id)
    except EmployeeProfile.DoesNotExist:
        return Response({"error": "User profile not found"}, status=404)

    serializer = EmployeeProfileSerializer(user_profile, data=request.data, partial=True)
    
    if serializer.is_valid():
        serializer.save()

        # Create a notification for the user
        Notification.objects.create(
            recipient=request.user,
            title="Profile Updated",
            action="Your profile has been successfully updated.",
            target_content_type=ContentType.objects.get_for_model(EmployeeProfile),
            target_object_id=user_profile.user_id
        )

        return Response({"message": "Account edited successfully"}, status=201)
    
    return Response(serializer.errors, status=400)


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_user_details(request, user_id=None): 
    if user_id:
        user = get_object_or_404(User, id=user_id)  
    else:
        user = request.user  

    user_profile = get_object_or_404(EmployeeProfile, user=user)  
    
    return Response({
        "user": user.username,
        "profile": EmployeeProfileSerializer(user_profile).data
    })

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_user_details_redirect(request):
    user = request.user

    user_profile = EmployeeProfile.objects.get(user_id=user.id)
    return Response({"user": user.username, "profile": EmployeeProfileSerializer(user_profile).data})

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_employer_details(request,user_id):

    user = User.objects.get(id=user_id)
    user_profile = EmployerProfile.objects.get(user_id=user_id)
  
    return Response({"user": User.objects.get(id=user_id).username, "profile": EmployerProfileSerializer(user_profile).data})






@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_user_preferences(request, user_id):
    """
    Check if an employee has set their preferences.
    """
    user = get_object_or_404(User, id=user_id)

    # Ensure the user is an employee
    if user.user_type != "Employee":
        return Response({"detail": "User is not an employee."}, status=status.HTTP_400_BAD_REQUEST)

    # Check if the user has preferences
    if user.preferences.exists():
        return Response({"has_preferences": True})
    else:
        return Response({"has_preferences": False})
    
@api_view(['GET'])
@permission_classes([IsAuthenticated])
def user_has_profile(request, user_id):
    user = get_object_or_404(User, id=user_id)

    # Check if the user has a profile
    if user.user_type == "Employer":
        profile = EmployerProfile.objects.filter(user_id=user.id).first()
        has_profile = profile is not None
    elif user.user_type == "Employee":
        profile = EmployeeProfile.objects.filter(user_id=user.id).first()
        has_profile = profile is not None
    else:
        has_profile = False

    return Response({"has_profile": has_profile})




from rest_framework.decorators import permission_classes
from rest_framework.permissions import IsAuthenticated
from django.http import JsonResponse
import pandas as pd
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity
from .models import JobPost, User, EmployeeProfile

@permission_classes([IsAuthenticated])
def recommend_jobs(request):
    user_id = request.GET.get("user_id")
    debug_mode = request.GET.get("debug") == "true"

    try:
        user = User.objects.get(id=user_id)
        emp_profile = EmployeeProfile.objects.get(user_id=user_id)
    except (User.DoesNotExist, EmployeeProfile.DoesNotExist):
        return JsonResponse({"message": "User or profile not found"}, status=404)

    # Preferences and profile
    preferred_tags = user.preferences.all()
    preferred_tag_names = [tag.name for tag in preferred_tags]
    user_disability = emp_profile.user_disability
    user_skills = emp_profile.skills

    # All job posts
    job_posts = JobPost.objects.all()
    job_data = [
        {
            "post_id": job.post_id,
            "job_title": job.job_title,
            "job_description": job.job_desc,
            "skills_required": job.skills_req or "",
            "tags": ", ".join(tag.name for tag in job.tags.all()),
            "disabilitytag": ", ".join(tag.name for tag in job.disabilitytag.all()),
            "comp_name": job.get_company_name(),
            "category": job.category,
            "location": job.location,
            "posted_by": job.posted_by.id if job.posted_by else None
        }
        for job in job_posts
    ]

    if not job_data:
        return JsonResponse({"message": "No jobs found"}, status=404)

    df = pd.DataFrame(job_data)
    df["combined_text"] = (
        df["job_description"] + " " +
        df["skills_required"] + " " +
        df["tags"] + " " +
        df["category"] + ", " +
        df["disabilitytag"]
    )

    # Create user profile text
    user_profile = (
        " ".join(preferred_tag_names) + " " +
        " ".join(preferred_tag_names) + ", " +
        user_disability + " " +
        (user_skills + " ") * 2
    )

    # TF-IDF and similarity
    tfidf_vectorizer = TfidfVectorizer(stop_words="english")
    tfidf_matrix = tfidf_vectorizer.fit_transform(df["combined_text"])
    user_vector = tfidf_vectorizer.transform([user_profile])
    similarity_scores = cosine_similarity(user_vector, tfidf_matrix).flatten()
    df["similarity_score"] = similarity_scores

    # Filters
    recommended_jobs = []
    debug_list = []

    user_disability_lower = user_disability.lower()
    user_skills_list = [s.strip().lower() for s in user_skills.split(",")]
    user_pref_tags_lower = [tag.lower() for tag in preferred_tag_names]

    def semantic_skill_match(user_skills, job_skills):
        if not user_skills or not job_skills:
            return False
    
        all_skills = user_skills + job_skills
        vectorizer = TfidfVectorizer().fit(all_skills)
        vectors = vectorizer.transform(all_skills)

        user_vecs = vectors[:len(user_skills)]
        job_vecs = vectors[len(user_skills):]

        similarity = cosine_similarity(user_vecs, job_vecs)
        return similarity.max() > 0.5
    
    for idx, row in df.iterrows():
        job_disabilities = row["disabilitytag"].lower().split(", ")
        job_skills_required = [s.strip().lower() for s in row["skills_required"].split(",")] if row["skills_required"] else []
        job_tags = row["tags"].lower().split(", ")

        disability_match = any(user_disability_lower in jd or jd in user_disability_lower for jd in job_disabilities)
        skill_match = semantic_skill_match(user_skills_list, job_skills_required)
        pref_match = any(utag in jtag or jtag in utag for utag in user_pref_tags_lower for jtag in job_tags)

        status = ""
        reason = []

        if not disability_match:
            status = "Excluded"
            reason.append("No disability match")
        elif not skill_match and not pref_match:
            status = "Excluded"
            reason.append("No skill or preference match")
        else:
            status = "Included"
            recommended_jobs.append(row)

        if status == "Included":
            print(f"[✔️ INCLUDED] Job ID {row['post_id']} - {row['job_title']}")
        else:
            print(f"[❌ EXCLUDED] Job ID {row['post_id']} - {row['job_title']} → Reason: {', '.join(reason)}")

        if debug_mode:
            debug_list.append({
            "post_id": row["post_id"],
            "job_title": row["job_title"],
            "match_status": status if not reason else ", ".join(reason),
            "similarity_score": row["similarity_score"]
        })

    if recommended_jobs:
        recommended_df = pd.DataFrame(recommended_jobs)
        recommended_df["similarity_score"] = recommended_df["similarity_score"].astype(float)
        top_recommendations = recommended_df.sort_values(by="similarity_score", ascending=False).head(5)

        if debug_mode:
            return JsonResponse({
                "recommended": top_recommendations.to_dict(orient="records"),
                "debug_info": debug_list
            }, safe=False)

        return JsonResponse(top_recommendations.to_dict(orient="records"), safe=False)
    else:
        if debug_mode:
            return JsonResponse({
                "message": "No suitable job recommendations found",
                "debug_info": debug_list
            }, status=200)
        return JsonResponse({"message": "No suitable job recommendations found"}, status=200)

@api_view(["GET"])  
def get_disability_tags(request):
    tags = DisabilityTag.objects.all()
    serializer = DisabilityTagSerializer(tags, many=True)
    return Response(serializer.data)

@api_view(["GET"])
def job_post_disability_tags(request, jobId): 
    try:
        job_post = JobPost.objects.get(post_id=jobId) 
        disability_tags = job_post.disabilitytag.all()
        serializer = DisabilityTagSerializer(disability_tags, many=True)
        return Response(serializer.data)
    except JobPost.DoesNotExist:
        return Response({"error": "Job post not found"}, status=404)

@api_view(["GET"])
def job_post_tags(request, jobId): 
    try:
        job_post = JobPost.objects.get(post_id=jobId) 
        tags = job_post.tags.all()
        serializer = TagSerializer(tags, many=True)
        return Response(serializer.data)
    except JobPost.DoesNotExist:
        return Response({"error": "Job post not found"}, status=404)

def get_job(request, post_id):
    job = get_object_or_404(JobPost, post_id=post_id)
    
    job_data = {
        "post_id": job.post_id,
        "job_title": job.job_title,
        "job_desc": job.job_desc,
        "job_type": job.job_type,
        "location": job.location,
        "category": job.category,
        "salary_range": job.salary_range,
    }
    
    return JsonResponse(job_data, safe=False)

@api_view(["POST"])
@parser_classes([MultiPartParser, FormParser]) 
@authentication_classes([TokenAuthentication])
@permission_classes([IsAuthenticated])
def apply_job(request):
    serializer = JobApplicationSerializer(data=request.data)
   
    if serializer.is_valid():
 
        job_application = serializer.save(applicant=request.user)  

        job = job_application.job_post
        employer = job.posted_by

   
        Notification.objects.create(
            recipient=employer,
            title="New Job Application",
            action=f"New applicant for {job.job_title}.",
            is_read=False
        )

        return Response({"message": "Application submitted successfully!"}, status=201)

    return Response(serializer.errors, status=400)

@api_view(["GET"])
@authentication_classes([TokenAuthentication])
@permission_classes([IsAuthenticated])
def employer_dashboard(request):
    employer = request.user
    jobs = JobPost.objects.filter(posted_by=employer)

    # Serialize job postings
    job_posts_data = list(jobs.values(
        "post_id", 
        "job_title", 
        "job_desc", 
        "job_type", 
        "category", 
        "location", 
        "salary_range", 
        "created_at"
    ))

    applications = Application.objects.filter(job_post__in=jobs, job_fair__isnull=True)

    applicants_data = list(applications.values(
        "applicant__employeeprofile__contact_no",
        "applicant__id",
        "applicant_name",
        "applicant_role",
        "applicant_experience",
        "applicant_location",
        "application_action",
        "application_status",
        "application_id",
        "applicant_skills",
        "job_post__job_title" 
    ))

    return JsonResponse({
        "active_jobs_count": jobs.count(),
        "total_applications": applications.count(),
        "applicants": applicants_data,
        "job_posts": job_posts_data  
        
    })


# START OF FORUMS VIEWS

class PostViewSet(viewsets.ModelViewSet):
    queryset = Post.objects.all().order_by('-created_at')
    serializer_class = PostSerializer
    permission_classes = [IsAuthenticated]
    def perform_create(self, serializer):
        title = self.request.data.get("title", "")  
        content = self.request.data.get("content", "")

        if contains_banned_words(title) or contains_banned_words(content):
           raise serializers.ValidationError({"error": "Post contains profanity/banned words"})
        serializer.save(user=self.request.user)  

class CommentViewSet(viewsets.ModelViewSet):
    queryset = Comment.objects.all().order_by('-created_at')
    serializer_class = CommentSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        post_id = self.request.query_params.get('post_id')
     
        if post_id:
            return self.queryset.filter(post__id=post_id)
        return self.queryset
    def perform_create(self, serializer):
        if(contains_banned_words(self.request.data.get("content"))):
            raise serializers.ValidationError({"error": "Comment contains profanity/banned words"})

        parent_id = self.request.data.get("parent")
    
        parent_comment = None

        if parent_id!=None:
            try:
                parent_comment = Comment.objects.get(id=parent_id)
            except Comment.DoesNotExist:
                raise serializers.ValidationError({"error": "Parent comment not found"})

        serializer.save(user=self.request.user, parent=parent_comment)
        

class ReportViewSet(viewsets.ModelViewSet):
    queryset = Report.objects.all().order_by("-created_at")
    serializer_class = ReportSerializer
    permission_classes = [IsAuthenticated]

    def perform_create(self, serializer):
        serializer.save(reported_by=self.request.user)

class BannedWordViewSet(viewsets.ModelViewSet):
    queryset = BannedWord.objects.all()
    serializer_class = BannedWordSerializer
    permission_classes = [IsAuthenticated]


def contains_banned_words(text):
    return BannedWord.objects.filter(word__in=text.lower().split()).exists()


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_notifications(request):
    notifications = Notification.objects.filter(recipient=request.user).order_by('-timestamp')
    serializer = NotificationSerializer(notifications, many=True)
    return Response(serializer.data)

@api_view(["PATCH"])
def mark_notification_read(request, notification_id):
    try:
        notification = Notification.objects.get(id=notification_id)
        notification.is_read = True
        notification.save()
        return Response({"message": "Notification marked as read"}, status=status.HTTP_200_OK)
    except Notification.DoesNotExist:
        return Response({"error": "Notification not found"}, status=status.HTTP_404_NOT_FOUND)
    
@api_view(["PATCH"])
def mark_all_notifications_read(request):
    try:
        Notification.objects.filter(is_read=False).update(is_read=True)
        return Response({"message": "All notifications marked as read"}, status=status.HTTP_200_OK)
    except Exception as e:
        return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
    
@api_view(['DELETE']) #api/delete-all-notifications
@permission_classes([IsAuthenticated])
def delete_all_notifications(request):
    notifications = Notification.objects.filter(recipient=request.user)
    notifications.delete()
    return Response({"message": "All notifications have been deleted."})


@api_view(['DELETE'])
@permission_classes([IsAuthenticated])
def delete_notification(request, notification_id):
    try:
        # Get the specific notification
        notification = Notification.objects.get(id=notification_id, recipient=request.user)
        notification.delete()
        return Response({"message": "Notification has been deleted."})
    except Notification.DoesNotExist:
        return Response({"error": "Notification not found or you do not have permission to delete it."}, status=404)


#g views

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def create_chat(request):
   
    other_user_id = request.data.get("other_user_id")
    print("Other id", other_user_id)
    user = request.user  
    print("Current user:", user)

   
    if user.user_type == 'Employer':
        employer = user
        employee = User.objects.get(id=other_user_id)
        print("Employer:" ,employer)
        print("Employee:", employee)
    elif user.user_type == 'Employee':
        employer = User.objects.get(id=other_user_id)
        employee = user
        print("Employer:" ,employer)
        print("Employee:", employee)
    else:
        return Response({"detail": "Invalid user type."}, status=status.HTTP_400_BAD_REQUEST)

    # Create or get the chat room between the employer and employee
    chat_room, created = ChatRooms.objects.get_or_create(employee=employee, employer=employer)

    return Response({"room_id": chat_room.id})

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_chat_messages(request, room_id):
    # Fetch the chat room
    room = ChatRooms.objects.get(id=room_id)
    
    # Determine the other user in the chat room
    if room.employee == request.user:
        other_user = room.employer
    else:
        other_user = room.employee
    
    # Fetch the messages in the chat room
    messages = Messages.objects.filter(room_id=room_id).order_by("timestamp")
    
    # Prepare the response with the other user's information
    response_data = {
        "other_user": {"username": other_user.username, "id": other_user.id},
        "messages": [
            {"sender": msg.sender.username, "content": msg.content, "timestamp": msg.timestamp} 
            for msg in messages
        ]
    }
    
    return Response(response_data)


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def send_message(request):
    """
    Create a message and store it in the associated chat room.
    """
    room_id = request.data.get("room_id")
    content = request.data.get("content")

    if not room_id or not content:
        return Response({"error": "Room ID and content are required."}, status=400)

    try:
        chat_room = ChatRooms.objects.get(id=room_id)
    except ChatRooms.DoesNotExist:
        return Response({"error": "Chat room not found."}, status=404)

    message = Messages.objects.create(room=chat_room, sender=request.user, content=content)

    return Response({
        "message_id": message.id,
        "sender": message.sender.username,
        "content": message.content,
        "timestamp": message.timestamp
    }, status=201)


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_user_chats(request):
    user = request.user

    chat_rooms = ChatRooms.objects.filter(employee=user) | ChatRooms.objects.filter(employer=user)

    chat_list = []
    for chat in chat_rooms:
        other_user = chat.employer if chat.employee == user else chat.employee  
        last_message = chat.messages.last()  

       
        profile_picture_url = None
        if other_user.profile_picture and hasattr(other_user.profile_picture, 'url'):
            profile_picture_url = str(other_user.profile_picture)

        chat_list.append({
            "room_id": chat.id,
            "other_user": other_user.username,
            "other_user_profile_picture": profile_picture_url,
            "other_user_type": other_user.user_type,
            "last_message": last_message.content if last_message else "No messages yet",
            "last_timestamp": last_message.timestamp if last_message else None,
        })

    return Response(chat_list)



@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_pending_users (request):

    users = EmployeeProfile.objects.filter(activated=False).select_related('user')

    serializer = EmployeeProfileSerializer(users, many=True)
    return Response(serializer.data)





@api_view(["POST"])
@permission_classes([IsAuthenticated])
def approve_user(request, id):
    try:
       
        user = EmployeeProfile.objects.get(user_id=id)
        user.activated=  True
        user.save()
        return Response({"message": "User approved successfully"}, status=status.HTTP_200_OK)
    except User.DoesNotExist:
        return Response({"error": "User not found"}, status=status.HTTP_404_NOT_FOUND)
    except Exception as e:
        return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

@api_view(["POST"])
@permission_classes([IsAuthenticated])
def reject_user(request, id):
    try:
        user_profile = EmployeeProfile.objects.get(user_id=id)
        user = User.objects.get(id=id)
        user_profile.delete()
        user.delete()
        return Response({"message": "User rejected successfully"}, status=status.HTTP_200_OK)
    except User.DoesNotExist:
        return Response({"error": "User not found"}, status=status.HTTP_404_NOT_FOUND)
    except Exception as e:
        return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
    

@api_view(["GET"])
@permission_classes([IsAuthenticated])
def get_preferences(request):

    user = request.user  
  
    preferences = user.preferences.all()
    serializer = TagSerializer(preferences, many=True)
    return Response(serializer.data)


@api_view(["GET"])
@permission_classes([IsAuthenticated])  
def get_all_jobs(request):
    job_posts = JobPost.objects.all()

    job_data = [
        {
            "post_id": job.post_id,
            "job_title": job.job_title,
            "job_description": job.job_desc,
            "skills_required": job.skills_req if job.skills_req else "",
            "tags": ", ".join(tag.name for tag in job.tags.all()),
            "disabilitytag": ", ".join(tag.name for tag in job.disabilitytag.all()), 
            "comp_name": job.get_company_name(),
            "category": job.category,
            "location": job.location,
            "posted_by": job.posted_by.id if job.posted_by else None
        }
        for job in job_posts
    ]

    if not job_data:
        return JsonResponse({"message": "No jobs found"}, status=404)

    return JsonResponse(job_data, safe=False)

@api_view(["GET"])
def get_all_jobs_public(request):
    job_posts = JobPost.objects.all()

    job_data = [
        {
            "post_id": job.post_id,
            "job_title": job.job_title,
            "job_description": job.job_desc,
            "skills_required": job.skills_req if job.skills_req else "",
            "tags": ", ".join(tag.name for tag in job.tags.all()),
            "disabilitytag": ", ".join(tag.name for tag in job.disabilitytag.all()), 
            "comp_name": job.get_company_name(),
            "category": job.category,
            "location": job.location,
            "posted_by": job.posted_by.id if job.posted_by else None
        }
        for job in job_posts
    ]

    if not job_data:
        return JsonResponse({"message": "No jobs found"}, status=404)

    return JsonResponse(job_data, safe=False)

@api_view(["GET"])
@permission_classes([IsAuthenticated])
def get_all_users (request):
    users =  EmployeeProfile.objects.all()
    serializer = EmployeeProfileSerializer(users, many=True)
    return Response(serializer.data)


@api_view(["GET"])
@permission_classes([IsAuthenticated])
def get_all_employers (request):
    users =  EmployerProfile.objects.all()
    serializer = EmployerProfileSerializer(users, many=True)
    return Response(serializer.data)


@api_view(["DELETE"])
@permission_classes([IsAuthenticated])
def delete_employer(request, id):
    user = User.objects.get(id=id)
    emp_profile = EmployerProfile.objects.get(user_id=id)
    emp_profile.delete()
    user.delete()
    return Response({"message": "User deleted successfully"}, status=status.HTTP_200_OK)


@api_view(["DELETE"])
@permission_classes([IsAuthenticated])
def delete_user(request, id):
    user = User.objects.get(id=id)
    emp_profile = EmployeeProfile.objects.get(user_id=id)
    emp_profile.delete()
    user.delete()
    return Response({"message": "User deleted successfully"}, status=status.HTTP_200_OK)


@api_view(["DELETE"])
@permission_classes([IsAuthenticated])
def delete_account(request):
    user = request.user
    user_obj = User.objects.get(id=user.id)
    emp_profile = EmployeeProfile.objects.get(user_id=user.id)

    user_obj.delete()
    emp_profile.delete()
    return Response({"message": "Account deleted successfully"}, status=status.HTTP_200_OK)


@api_view(["DELETE"])
@permission_classes([IsAuthenticated])
def delete_emp_account(request):
    user = request.user
    user_obj = User.objects.get(id=user.id)
    emp_profile = EmployerProfile.objects.get(user_id=user.id)

    user_obj.delete()
    emp_profile.delete()
    return Response({"message": "Account deleted successfully"}, status=status.HTTP_200_OK)


#Accept at decline ng job

@api_view(["POST"])
@permission_classes([IsAuthenticated])
def approve_application(request, application_id):
    try:
        application = Application.objects.get(application_id=application_id)
        application.application_status = "Approved"
        application.application_action = "Approved"
        application.save()

       
        Notification.objects.create(
            recipient=application.applicant, 
            title="Application Approved",
            action=f"Your application for {application.job_post.job_title} has been approved!",
            target_content_type=ContentType.objects.get_for_model(Application),
            target_object_id=application.application_id
        )

        return JsonResponse({"message": "Application approved successfully"}, status=200)

    except Application.DoesNotExist:
        return JsonResponse({"error": "Application not found"}, status=404)
    except Exception as e:
        return JsonResponse({"error": str(e)}, status=500)
    
@api_view(["POST"])
@permission_classes([IsAuthenticated])
def decline_application(request, application_id):
    try:
        application = Application.objects.get(application_id=application_id)
        application.application_status = "Declined"
        application.save()

     
        Notification.objects.create(
            recipient=application.applicant, 
            title="Application Declined",
            action=f"Your application for {application.job_post.job_title} has been declined.",
            target_content_type=ContentType.objects.get_for_model(Application),
            target_object_id=application.application_id
        )

        return JsonResponse({"message": "Application declined successfully"}, status=200)

    except Application.DoesNotExist:
        return JsonResponse({"error": "Application not found"}, status=404)
    except Exception as e:
        return JsonResponse({"error": str(e)}, status=500)


User = get_user_model()

def platform_statistics(request):

    employee_count = User.objects.filter(user_type="employee").count()

   
    employer_count = User.objects.filter(user_type="employer").count()


    jobs_posted_count = JobPost.objects.count()

    disability_types = (
        DisabilityTag.objects.filter(jobpost__isnull=False) 
        .annotate(job_count=Count("jobpost"))
        .values("name", "job_count")
    )

    return JsonResponse({
        "employee_count": employee_count,
        "employer_count": employer_count,
        "jobs_posted_count": jobs_posted_count,
        "disability_types": list(disability_types)
    })




reader = easyocr.Reader(["en"])  # Load English model

@csrf_exempt
def ocr_view(request):
    if request.method == "POST" and request.FILES.get("image"):
        image_file = request.FILES["image"]
        image = Image.open(image_file)
        image = np.array(image)

        text = reader.readtext(image, detail=0)  # Extract text

        return JsonResponse({"text": " ".join(text)})

    return JsonResponse({"error": "Invalid request"}, status=400)


@api_view(["PUT"])
def edit_job_post(request, jobId):

    if not request.user.is_authenticated:
        return Response({"error": "User is not authenticated"}, status=status.HTTP_401_UNAUTHORIZED)

    if not request.user.is_authenticated:
        return Response({"error": "User is not authenticated"}, status=403)
    
    try:
        job_post = JobPost.objects.get(post_id=jobId, posted_by=request.user)
    except JobPost.DoesNotExist:
        return Response({"error": "Job post not found or unauthorized"}, status=403)
    
    serializer = JobPostSerializer(job_post, data=request.data, partial=True)
    if serializer.is_valid():
        job_post = serializer.save()
        return Response(JobPostSerializer(job_post).data, status=200)
    
    return Response({"error": "Invalid data", "details": serializer.errors}, status=400)

@api_view(["DELETE"])
def delete_job(request,jobId):
    

    if not request.user.is_authenticated:
        return Response({"error": "User is not authenticated"}, status=status.HTTP_401_UNAUTHORIZED)

    if not request.user.is_authenticated:
        return Response({"error": "User is not authenticated"}, status=403)
    try:
        job_post = JobPost.objects.get(post_id=jobId, posted_by=request.user)
        job_post.delete()
        return Response({"message": "Job post deleted successfully"}, status=200)
    except JobPost.DoesNotExist:
        return Response({"error": "Job post not found or unauthorized"}, status=403)

@api_view(["GET"])
def my_applications(request):
    user = request.user
    applications = Application.objects.filter(applicant=user).select_related(
    "job_post", "job_post__posted_by__employerprofile"
)
    serializer = JobApplicationSerializerv2(applications, many=True)
    return Response(serializer.data)


@api_view(["GET"])
def all_reports(request):
  
    reports = Report.objects.select_related("reported_by", "post").order_by("-created_at")
    serializer = ReportSerializerv2(reports, many=True)
    return Response(serializer.data)


@api_view(["DELETE"])
def cancel_application(request,application_id):
    try:
        application = Application.objects.get(application_id=application_id)
        application.delete()
        return Response({"message": "Application cancelled successfully"}, status=200)
    except Application.DoesNotExist:
        return Response({"error": "Application not found"}, status=404)
    except Exception as e:
        return Response({"error": str(e)}, status=500)
    

@api_view(["DELETE"])
def delete_application(request,application_id):
    try:
        application = Application.objects.get(application_id=application_id)
        application.delete()
        return Response({"message": "Application deleted successfully"}, status=200)
    except Application.DoesNotExist:
        return Response({"error": "Application not found"}, status=404)
    except Exception as e:
        return Response({"error": str(e)}, status=500)
    
#job fair view

class JobFairViewSet(viewsets.ModelViewSet):
    queryset = JobFair.objects.all()
    serializer_class = JobFairSerializer
    

    def perform_create(self, serializer):

        serializer.save(organizer=self.request.user)


class JobFairRegistrationViewSet(viewsets.ModelViewSet):
    queryset = JobFairRegistration.objects.all()
    serializer_class = JobFairRegistrationSerializer
    permission_classes = [IsAuthenticated]

    def perform_create(self, serializer):
        job_fair = serializer.validated_data['job_fair']
        user = self.request.user  

 
        if JobFairRegistration.objects.filter(job_fair=job_fair, user=user).exists():
            raise serializers.ValidationError("You are already registered for this job fair.")

        serializer.save(user=user)


class JobFairJobListView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request, job_fair_id):
        job_fair = JobFair.objects.filter(id=job_fair_id).annotate(
            registrations_count=Count('jobfairregistration')
        ).first()

        if not job_fair:
            return Response({"detail": "Job fair not found."}, status=404)

        # Check if the user has registered for the job fair
        if not JobFairRegistration.objects.filter(job_fair=job_fair, user=request.user).exists():
            return Response({"detail": "You must register for this job fair first."}, status=400)

        # Get the jobs for the job fair
        jobs = job_fair.jobs.all()

        # Prepare the job data
        job_data = [
            {
                "job_title": job.job_title,
                "job_desc": job.job_desc,
                "location": job.location,
                "company_name": job.get_company_name(),
                "post_id": job.post_id
            }
            for job in jobs
        ]

        # Include the registration count in the response
        return Response({
            "job_fair": job_fair.title,
            "registrations_count": job_fair.registrations_count,  # Include the registration count
            "jobs": job_data
        })
    
class EmployerJobFairJobListView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request, job_fair_id):
        job_fair = JobFair.objects.get(id=job_fair_id)
       
        jobs = job_fair.jobs.all()

   
        job_data = [{"job_title": job.job_title, "job_desc": job.job_desc, "location":job.location,"company_name":job.get_company_name(),"post_id":job.post_id} for job in jobs]

        return Response({"job_fair": job_fair.title, "jobs": job_data})


class EmployerJobListView(APIView):
    permission_classes = [IsAuthenticated]  

    def get(self, request):
        
        employer_jobs = JobPost.objects.filter(posted_by=request.user)

        serializer = JobPostSerializer(employer_jobs, many=True)

        return Response(serializer.data, status=status.HTTP_200_OK)

class JobListDataView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request, jobfair_id):
    
        job_fair = JobFair.objects.filter(id=jobfair_id).first()

        if not job_fair:
            return Response({"detail": "Job fair not found."}, status=status.HTTP_404_NOT_FOUND)

       
        job_fair_job_posts = JobFairJobPost.objects.filter(jobfair=job_fair)

    
        job_posts = [job_fair_job_post.jobpost for job_fair_job_post in job_fair_job_posts]

   
        serializer = JobPostSerializer(job_posts, many=True)

        return Response(serializer.data, status=status.HTTP_200_OK)


class JobFairApplicationsView(APIView):
    permission_classes = [IsAuthenticated]
   
    def get(self, request, jobfair_id):
        job_fair = JobFair.objects.filter(id=jobfair_id).first()
        if not job_fair:
            return Response({"detail": "Job fair not found."}, status=status.HTTP_404_NOT_FOUND)

        job_applications = Application.objects.filter(job_fair=job_fair)
        serializer = JobApplicationSerializer(job_applications, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)

    def post(self, request, jobfair_id):
        job_fair = JobFair.objects.filter(id=jobfair_id).first()
        if not job_fair:
            return Response({"detail": "Job fair not found."}, status=status.HTTP_404_NOT_FOUND)

        job_id = request.data.get("job")  
        if not job_id:
            return Response({"detail": "Job ID is required."}, status=status.HTTP_400_BAD_REQUEST)

        job_post = JobPost.objects.filter(post_id=job_id).first()
        if not job_post:
            return Response({"detail": "Job not found."}, status=status.HTTP_404_NOT_FOUND)

        emp_profile = EmployeeProfile.objects.get(user_id=request.user.id)

       
        existing_application = Application.objects.filter(
            job_post=job_post,
            applicant=request.user,
            job_fair=job_fair
        ).first()

        if existing_application:
            return Response({"detail": "You have already applied for this job during this job fair."},
                            status=status.HTTP_400_BAD_REQUEST)

        data = request.data.copy()
        data["job_fair"] = job_fair.id
        data["applicant"] = request.user.id 
        data["job_post"] = job_post.post_id
        data["applicant_name"] = emp_profile.full_name
        data["applicant_role"] = "N/A"
        data["application_action"] = "For Approval"

        serializer = JobApplicationSerializer(data=data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def put(self, request, jobfair_id):
        application_id = request.data.get("application_id")
        if not application_id:
            return Response({"detail": "Application ID is required."}, status=status.HTTP_400_BAD_REQUEST)

        application = Application.objects.filter(application_id=application_id, job_fair_id=jobfair_id).first()
        if not application:
            return Response({"detail": "Application not found."}, status=status.HTTP_404_NOT_FOUND)

        serializer = JobApplicationSerializer(application, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def delete(self, request, jobfair_id):
        application_id = request.data.get("application_id")
        if not application_id:
            return Response({"detail": "Application ID is required."}, status=status.HTTP_400_BAD_REQUEST)

        application = Application.objects.filter(application_id=application_id, job_fair_id=jobfair_id).first()
        if not application:
            return Response({"detail": "Application not found."}, status=status.HTTP_404_NOT_FOUND)

        application.delete()
        return Response({"detail": "Application deleted successfully."}, status=status.HTTP_204_NO_CONTENT)

    
class UploadPWDCardView(APIView):
    parser_classes = [MultiPartParser, FormParser]

    def post(self, request):
        serializer = PWDCardSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response({"message": "PWD Card uploaded successfully", "data": serializer.data})
        return Response(serializer.errors, status=400)

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def GetPWDCardImage(request,user_id):
    try:
        pwd_card = PWDCard.objects.get(user=user_id)
        serializer = PWDCardSerializer(pwd_card)
        return Response(serializer.data, status=200)
    except PWDCard.DoesNotExist:
        return Response({"error": "PWD Card not found"}, status=404)
    


#forgot password



User = get_user_model()
@csrf_exempt
def forgot_password(request):
    if request.method == "POST":
        try:
            data = json.loads(request.body)
            email = data.get("email")

            if not email:
                return JsonResponse({"error": "Email is required."}, status=400)

            user = User.objects.filter(email=email).first()

            if user:
                # Create token for password reset
                token_generator = PasswordResetTokenGenerator()
                token = token_generator.make_token(user)
                uid = urlsafe_base64_encode(force_bytes(user.pk))
                
                # Construct the reset URL
                
             
            
 
    # Create the email content using the reset_url
                subject = 'Password Reset Request'
                message = f"Hi {user.first_name},\n\n" \
                f"You requested a password reset. Click the link below to reset your password:\n" \
                f"https://hanapwede.com/reset-password/{uid}/{token}/\n\n" \
                f"If you didn't request this, please ignore this email."

                send_mail(subject, message, settings.DEFAULT_FROM_EMAIL, [email])

                return JsonResponse({"message": "Password reset email sent."}, status=200)

            else:
                return JsonResponse({"error": "No account found with that email."}, status=404)

        except json.JSONDecodeError:
            return JsonResponse({"error": "Invalid JSON data."}, status=400)

        except Exception as e:
            return JsonResponse({"error": str(e)}, status=500)
    else:
        return JsonResponse({"error": "Invalid request method."}, status=405)
@csrf_exempt
def reset_password(request, uidb64, token):
    try:
        # Decode the UID from the base64 encoded string
        uid = urlsafe_base64_decode(uidb64).decode()
        user = User.objects.get(pk=uid)
    except (TypeError, ValueError, OverflowError, User.DoesNotExist):
        return JsonResponse({"error": "Invalid link or expired."}, status=400)

    # Check if the token is valid
    if not default_token_generator.check_token(user, token):
        return JsonResponse({"error": "Invalid or expired token."}, status=400)

    if request.method == 'POST':
        # Parse the incoming JSON request body
        try:
            data = json.loads(request.body)
            new_password = data.get("new_password")
            
            if not new_password:
                return JsonResponse({"error": "New password is required."}, status=400)

            # Set and save the new password
            user.set_password(new_password)
            user.save()

            return JsonResponse({"message": "Your password has been successfully updated."}, status=200)
        
        except json.JSONDecodeError:
            return JsonResponse({"error": "Invalid JSON data."}, status=400)

    return JsonResponse({"error": "Invalid request method."}, status=405)


from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_profile_picture(request):
    user = request.user
    profile_picture_url = user.profile_picture.url if user.profile_picture else None

    return Response({
        "profile_picture": request.build_absolute_uri(profile_picture_url) if profile_picture_url else None
    })

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def registered_users_jobfair(request):
    job_fair_id = request.GET.get("job_fair_id")
    user_id = request.GET.get("user")
    if not job_fair_id:
        return Response({"error": "Missing JOB FAIR ID."}, status=400)

    try:
        job_fair = JobFair.objects.get(id=job_fair_id)
    except JobFair.DoesNotExist:
        return Response({"error": "WALANG JOB FAIR ID."}, status=404)

    registrations = JobFairRegistration.objects.filter(job_fair=job_fair).select_related('user', 'user__employeeprofile')
    serializer = JobFairRegistrationSerializer(registrations, many=True)
    print(serializer.data)

    return Response(serializer.data, status=200)