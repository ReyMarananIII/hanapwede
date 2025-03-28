import os
import django
os.environ.setdefault("DJANGO_SETTINGS_MODULE", "hanapwede.settings")
django.setup()

from hanapwedeApp.models import User, JobPost
from hanapwedeApp.views import recommend_jobs  
import pandas as pd
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity
from sklearn.metrics import precision_score, recall_score, f1_score
import json

def evaluate_recommendation(user_id):
    """
    Evaluate the recommendation accuracy for a given user based on job description similarity & jobs applied.
    
    Classification: 
        # Binary classification (1 = relevant, 0 = irrelevant)
        # Relevant: If similarity score > threshold
        # Irrelevant: If similarity score <= threshold

    Parameters:
        user_id (int): The ID of the user being tested.

        ground_truth_jobs (list): List of job IDs the user actually applied for
        ground_truth_texts (list): List of job descriptions the user actually applied for

    Returns:
        results (dict): Precision, recall, and F1-score
        dict: Precision, recall, and F1-score

        Precision: The proportion of recommended jobs that the user actually applied for
        Recall: The proportion of jobs the user applied for that were recommended
        F1-score: The mean/average of precision and recall
    """


    #Retrieve the ground truth job descriptions 
    ground_truth_jobs = JobPost.objects.filter(post_id__in=[5, 8]) # Static job IDs (testing lng)
    
    if not ground_truth_jobs.exists():
        return {"error": "User has not applied for any jobs."}
    
    ground_truth_texts = [
        (job.job_desc + " " + job.skills_req).strip() if job.skills_req else job.job_desc.strip()
        for job in ground_truth_jobs
    ]
    
    print("Ground Truth Texts:", ground_truth_texts)

    # kunin recommended jobs
    response = recommend_jobs(user_id)
    try:
        recommended_jobs = json.loads(response.content)
    except json.JSONDecodeError:
        return {"error": "Invalid JSON response from recommendation system."}
    

    recommended_texts = [
        (job["job_description"] + " " + job["skills_required"]).strip() if job["skills_required"] else job["job_description"].strip()
        for job in recommended_jobs
    ]
    
    print("Recommended Texts:", recommended_texts)

    # error handling kung meron job desc
    if not ground_truth_texts or not recommended_texts:
        return {"error": "Insufficient job descriptions for comparison."}

    #convert yung created text to tf-idf matrix
    tfidf_vectorizer = TfidfVectorizer(stop_words="english")
    all_texts = ground_truth_texts + recommended_texts
    tfidf_matrix = tfidf_vectorizer.fit_transform(all_texts)

    print("TF-IDF Matrix Shape:", tfidf_matrix.shape)
    
    ground_truth_vectors = tfidf_matrix[: len(ground_truth_texts)]
    recommended_vectors = tfidf_matrix[len(ground_truth_texts):]

    print("Ground Truth Vectors Shape:", ground_truth_vectors.shape)
    print("Recommended Vectors Shape:", recommended_vectors.shape)

    # calculate yung similarity score
    similarity_scores = cosine_similarity(recommended_vectors, ground_truth_vectors)
    
    print("Similarity Scores:\n", similarity_scores)

    # Convert to binary classification: 1 if similar (> threshold), else 0
    threshold = 0.2  # threshold ng similarity score
    y_true = [1 if any(sim > threshold for sim in similarity_scores[i]) else 0 for i in range(len(recommended_jobs))]
    y_pred = [1 if max(sim) > threshold else 0 for sim in similarity_scores]

    print("y_true:", y_true)
    print("y_pred:", y_pred)

    # compute yung meaningful metrics declared above 
    precision = precision_score(y_true, y_pred, zero_division=1)
    recall = recall_score(y_true, y_pred, zero_division=1)
    f1 = f1_score(y_true, y_pred, zero_division=1)

    return {"precision": precision, "recall": recall, "f1_score": f1}

# Sample with real user ID(19) 
 
user_id = 19  
results = evaluate_recommendation(user_id) #call yung function para makuha na metrics data tas print
print("Final Results:", results)
