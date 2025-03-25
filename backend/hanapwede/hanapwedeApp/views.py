from django.views.decorators.csrf import csrf_exempt
from django.contrib.auth import get_user_model
from django.shortcuts import get_object_or_404
from django.contrib.auth.hashers import make_password
from django.contrib.contenttypes.models import ContentType
from django.db.models import Count
from hanapwedeApp.models import EmployeeProfile,Notification
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
from .serializer import JobPostSerializer
from .models import Tag, User, JobPost, DisabilityTag,Application
from .serializer import TagSerializer, DisabilityTagSerializer,JobApplicationSerializer
import pandas as pd
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity
from rest_framework.parsers import MultiPartParser, FormParser
from rest_framework.authentication import TokenAuthentication
from rest_framework import viewsets
from hanapwedeApp.models import ChatRooms , Messages, Application


from .serializer import PostSerializer, CommentSerializer, ReportSerializer, BannedWordSerializer
from .serializer import EmployeeProfileSerializer,NotificationSerializer
User = get_user_model()
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
                EmployeeProfile.objects.create(user_id = user.id,
                                               user_disability=user_disability,
                ID_no=ID_number)

            return JsonResponse({"message": "User created successfully."}, status=201)

        except json.JSONDecodeError:
            return JsonResponse({"error": "Invalid JSON data."}, status=400)

    return JsonResponse({"error": "Invalid request method."}, status=405)

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
   
    has_profile=False
    if user.user_type == "Employer":
        profile = EmployerProfile.objects.filter(user_id=user.id).first()
       
        if profile:
            has_profile=True
    elif user.user_type == "Employee":
        profile = EmployeeProfile.objects.filter(user_id=user.id).first()
    
        if not profile.activated:
            return JsonResponse({"error": "Registration Pending Approval"}, status=400)
        
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
    return Response({"message": "Preferences saved successfully"})





@api_view(['PUT'])
@permission_classes([IsAuthenticated])
def edit_profile(request):
    id = request.user.id

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
def get_user_details(request,user_id):

    user = User.objects.get(id=user_id)
    user_profile = EmployeeProfile.objects.get(user_id=user_id)
  
    return Response({"user": User.objects.get(id=user_id).username, "profile": EmployeeProfileSerializer(user_profile).data})






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



@permission_classes([IsAuthenticated]) 
def recommend_jobs(request):
    user_id = request.GET.get("user_id")  
    user = User.objects.get(id=user_id)
    

    preferred_tags = user.preferences.all()
    preferred_tag_names = [tag.name for tag in preferred_tags]
    emp_profile = EmployeeProfile.objects.get(user_id=user_id)
    user_disability = emp_profile.user_disability

    job_posts = JobPost.objects.all()
  
    job_data = [
        {
            "post_id": job.post_id,
            "job_title": job.job_title,
            "job_description": job.job_desc,
            "skills_required": job.skills_req if job.skills_req else "",
            "tags": ", ".join(tag.name for tag in job.tags.all()),
            "disabilitytag": ", ".join(tag.name for tag in job.disabilitytag.all()),
            "comp_name":job.get_company_name(),
            "category":job.category,
            "location":job.location,
            "posted_by": job.posted_by.id if job.posted_by else None
        }
        for job in job_posts
    ]

    if not job_data:
        return JsonResponse({"message": "No jobs found"}, status=404)

    df = pd.DataFrame(job_data)
    df["combined_text"] = df["job_description"] + " " + df["skills_required"] + " " + df["tags"] +" " + df["category"] + ", " +  (df["disabilitytag"] + " ") * 2

    user_profile = " ".join(preferred_tag_names) + ", " + (user_disability + " ") * 2
  

    tfidf_vectorizer = TfidfVectorizer(stop_words="english")
    tfidf_matrix = tfidf_vectorizer.fit_transform(df["combined_text"])

    user_vector = tfidf_vectorizer.transform([user_profile])

    similarity_scores = cosine_similarity(user_vector, tfidf_matrix).flatten()

    df["similarity_score"] = similarity_scores
    recommended_jobs = df.sort_values(by="similarity_score", ascending=False).head(3) #count nung irereturn na jobs, ranked by similarity score

    return JsonResponse(recommended_jobs.to_dict(orient="records"), safe=False)

@api_view(["GET"])  
def get_disability_tags(request):
    tags = DisabilityTag.objects.all()
    serializer = DisabilityTagSerializer(tags, many=True)
    return Response(serializer.data)



def get_job(request, post_id):
    job = get_object_or_404(JobPost, post_id=post_id)
    
    job_data = {
        "post_id": job.post_id,
        "job_title": job.job_title,
        "job_desc": job.job_desc,
        "job_type": job.job_type,
        "location": job.location,
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

    applications = Application.objects.filter(job_post__in=jobs)

    applicants_data = list(applications.values(
        "applicant_name",
        "applicant_role",
        "applicant_experience",
        "applicant_location",
        "application_action",
        "application_status",
        "application_id",
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
    



#g views

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def create_chat(request):
    employer_id = request.data.get("employer_id")
    employee = request.user
    employer = User.objects.get(id=employer_id)

   
    chat_room, created = ChatRooms.objects.get_or_create(employee=employee, employer=employer)

    return Response({"room_id": chat_room.id})

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_chat_messages(request, room_id):
    messages = Messages.objects.filter(room_id=room_id).order_by("timestamp")
    return Response([{"sender": msg.sender.username, "content": msg.content, "timestamp": msg.timestamp} for msg in messages])

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
        chat_list.append({
            "room_id": chat.id,
            "other_user": other_user.username,
            "other_user_type": other_user.user_type,
            "last_message": last_message.content if last_message else "No messages yet",
            "last_timestamp": last_message.timestamp if last_message else None,
        })

    return Response(chat_list)



@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_pending_users (request):
    users =  EmployeeProfile.objects.filter(activated=False)
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
        user = EmployeeProfile.objects.get(user_id=id)
        user.status = "False"  
        user.save()
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
@permission_classes([IsAuthenticated])
def get_all_users (request):
    users =  EmployeeProfile.objects.all()
    serializer = EmployeeProfileSerializer(users, many=True)
    return Response(serializer.data)

@api_view(["DELETE"])
@permission_classes([IsAuthenticated])
def delete_user(request, id):
    user = User.objects.get(id=id)
    emp_profile = EmployeeProfile.objects.get(user_id=id)
    emp_profile.delete()
    user.delete()
    return Response({"message": "User deleted successfully"}, status=status.HTTP_200_OK)


#Accept at decline ng job

@api_view(["POST"])
@permission_classes([IsAuthenticated])
def approve_application(request, application_id):
    try:
        application = Application.objects.get(applicaton_id=application_id)
        application.application_status = "Approved"
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