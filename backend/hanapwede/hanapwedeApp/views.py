from django.views.decorators.csrf import csrf_exempt
from django.contrib.auth import get_user_model
from django.contrib.auth.hashers import make_password
import json
from django.contrib.auth import authenticate
from rest_framework.authtoken.models import Token
from django.contrib.auth import logout
from django.http import JsonResponse
from rest_framework import status
from rest_framework.response import Response
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from .models import EmployerProfile
from .serializer import EmployerProfileSerializer
from .serializer import JobPostSerializer
from .models import Tag, User, JobPost
from .serializer import TagSerializer
import pandas as pd
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity

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
            print(user_type)

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
                user_type=user_type
            )

            return JsonResponse({"message": "User created successfully."}, status=201)

        except json.JSONDecodeError:
            return JsonResponse({"error": "Invalid JSON data."}, status=400)

    return JsonResponse({"error": "Invalid request method."}, status=405)

@api_view(["POST"])
def login_view(request):
    email = request.data.get("email")
    password = request.data.get("password")

    try:
        user = User.objects.get(email=email)
    except User.DoesNotExist:
        return JsonResponse({"error": "Invalid credentials."}, status=400)

    user = authenticate(username=user.username, password=password)

    if user is not None:
        token, _ = Token.objects.get_or_create(user=user)
        print(token)
        print(token.key)
        print(user.user_type)
        return JsonResponse({"token": token.key, "message": "Login successful.","user_type":user.user_type,'userId':user.id}, status=200)
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
@permission_classes([IsAuthenticated]) 
def post_job(request):
    user = request.user

    if user.user_type != "Employer":
        return Response({"error": "Unauthorized. Only employers can post jobs."}, status=status.HTTP_403_FORBIDDEN)

    serializer = JobPostSerializer(data=request.data)
    if serializer.is_valid():
        serializer.save(posted_by_id=user.id)  
        return Response({"message": "Job posted successfully!", "data": serializer.data}, status=status.HTTP_201_CREATED)

    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

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

@permission_classes([IsAuthenticated]) 
def recommend_jobs(request):
    user_id = request.GET.get("user_id")  
    user = User.objects.get(id=user_id)

    preferred_tags = user.preferences.all()
    preferred_tag_names = [tag.name for tag in preferred_tags]

    job_posts = JobPost.objects.all()
  
    job_data = [
        {
            "job_id": job.post_id,
            "job_title": job.job_title,
            "job_description": job.job_desc,
            "skills_required": job.skills_req if job.skills_req else "",
            "tags": ", ".join(tag.name for tag in job.tags.all()),
            "comp_name":job.get_company_name(),
            "comp_location":job.get_company_location()
        }
        for job in job_posts
    ]

    if not job_data:
        return JsonResponse({"message": "No jobs found"}, status=404)

    df = pd.DataFrame(job_data)
    df["combined_text"] = df["job_description"] + " " + df["skills_required"] + " " + df["tags"]

    user_profile = " ".join(preferred_tag_names)

    tfidf_vectorizer = TfidfVectorizer(stop_words="english")
    tfidf_matrix = tfidf_vectorizer.fit_transform(df["combined_text"])

    user_vector = tfidf_vectorizer.transform([user_profile])

    similarity_scores = cosine_similarity(user_vector, tfidf_matrix).flatten()

    df["similarity_score"] = similarity_scores
    recommended_jobs = df.sort_values(by="similarity_score", ascending=False).head(2) #count nung irereturn na jobs, ranked by similarity score

    return JsonResponse(recommended_jobs.to_dict(orient="records"), safe=False)