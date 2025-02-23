import { useState, useEffect } from "react";
import LoggedInHeader from "./LoggedInHeader";

export default function ForumPage() {
  const [posts, setPosts] = useState([]);
  const [showNewPostModal, setShowNewPostModal] = useState(false);
  const [showReportModal, setShowReportModal] = useState(false);
  const [reportedPostId, setReportedPostId] = useState(null);
  const[reportedCommentId, setReportedCommentId]=useState(null);
  const [reportReason, setReportReason] = useState("");

  const [reportDetails, setReportDetails] = useState("");
  const [newPost, setNewPost] = useState({ title: "", content: "" });
  const [newComment, setNewComment] = useState("");
  const [activeCommentPost, setActiveCommentPost] = useState(null);
  const [activeReplyComment, setActiveReplyComment] = useState(null);


  const [activePostId, setActivePostId] = useState(null); 
const [activeCommentId, setActiveCommentId] = useState(null);

  const [loading, setLoading] = useState(true);
  const API_BASE_URL = "http://127.0.0.1:8000/api"; //papaltan pa to lahat para mas readable


  useEffect(() => {
    const token = localStorage.getItem("authToken"); 
  
    fetch(`${API_BASE_URL}/posts/`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Token ${token}`, 
      },
    })
      .then((res) => {
        if (!res.ok) {
          throw new Error("Failed to fetch posts");
        }
        return res.json();
      })
      .then(async (data) => {
     
        const postsWithComments = await Promise.all(
          data.map(async (post) => {
            const res = await fetch(`${API_BASE_URL}/comments/?post_id=${post.id}`, {
              method: "GET",
              headers: {
                "Content-Type": "application/json",
                Authorization: `Token ${token}`, 
              },
            });
  
            if (!res.ok) {
              console.warn(`Failed to fetch comments for post ${post.id}`);
              return { ...post, comments: [] }; 
            }
  
            const comments = await res.json();
            return { ...post, comments };
          })
        );
  
        setPosts(postsWithComments);
        setLoading(false);
      })
      .catch((error) => console.error("Error fetching posts:", error));
  }, []);


  const handleReport = () => {
    if (!reportReason) {
      alert("Please select a reason for reporting.");
      return;
    }
  
    const reportData = {
      reason: reportReason,
      reported_by: localStorage.getItem("userId"),
      post:""
    };
    console.log(reportData.post)
  
    // kung comment  reported
    if (typeof reportedCommentId !== "undefined" && reportedCommentId !== null) {
        reportData.comment = reportedCommentId;
      } 
      // kung post  reported
      else if (typeof reportedPostId !== "undefined" && reportedPostId !== null) {
        
        reportData.post = reportedPostId;
        console.log(reportData.post)
      } 
      else {
        alert("Error: No post or comment selected.");
        return;
      }
  
    fetch(`${API_BASE_URL}/reports/`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Token ${localStorage.getItem("authToken")}`,
      },
      body: JSON.stringify(reportData),
    })
      .then((res) => res.json())
      .then(() => {
        alert("Report submitted successfully.");
        setShowReportModal(false);
        setReportReason("");
        setReportDetails("");
      })
      .catch((error) => {
        console.error("Error submitting report:", error);
        alert("Failed to submit report. Please try again.");
      });
  };
  
 
  const handleCreatePost = (e) => {
    e.preventDefault();
    fetch(`${API_BASE_URL}/posts/`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Token ${localStorage.getItem("authToken")}`, 
      },
      body: JSON.stringify(newPost),
    })
      .then((res) => res.json())
      .then((post) => {
        setPosts([{ ...post, comments: [] }, ...posts]); 
        setNewPost({ title: "", content: "" });
        setShowNewPostModal(false);
      })
      .catch((error) => console.error("Error creating post:", error));
  };

  // Add a comment to a post
  const handleAddComment = (postId, parentId = null) => {
    console.log(parentId)
    fetch(`${API_BASE_URL}/comments/`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Token ${localStorage.getItem("authToken")}`,
        },
        body: JSON.stringify({
            post: postId,
            content: newComment,
            parent: parentId,
        }),
    })
        .then((res) => {
            if (!res.ok) {
                throw new Error("Failed to add comment");
            }
            return res.json();
        })
        .then((comment) => {
            const updatedPosts = posts.map((post) => {
                if (post.id === postId) {
                    return {
                        ...post,
                        comments: post.comments.map((c) => {
                         
                            if (c.id === parentId) {
                                return {
                                    ...c,
                                    replies: [...(c.replies || []), comment],
                                };
                            }
                            return c;
                        }),
                    };
                }
                return post;
            });

            setPosts(updatedPosts);
            setNewComment("");
            setActiveCommentPost(null);
        })
        .catch((error) => console.error("Error adding comment:", error));
};
  

  const formatDate = (dateString) => {
    const options = { year: "numeric", month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" };
    return new Date(dateString).toLocaleDateString("en-US", options);
  };

  return (
    <div className="min-h-screen bg-[#F8FBFF]">
      <LoggedInHeader />
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-2xl font-bold">Employer Forum</h1>
          <button
            onClick={() => setShowNewPostModal(true)}
            className="bg-[#4CAF50] text-white px-4 py-2 rounded-lg hover:bg-[#45a049] transition-colors"
          >
            Create New Post
          </button>
        </div>

        {loading ? (
          <p>Loading posts...</p>
        ) : (
          <div className="space-y-6">
            {posts.map((post) => (
              <div key={post.id} className="bg-white rounded-lg shadow-sm p-6">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h2 className="text-xl font-semibold mb-2">{post.title}</h2>
                    <div className="text-sm text-gray-500">
                      Posted by {post.user} • {formatDate(post.created_at)}
                    </div>
                  </div>
                  <button
                    onClick={() => {
                      setReportedPostId(post.id);
                      
                      setShowReportModal(true);
                    }}
                    className="text-red-500 hover:text-red-600"
                  >
                    Report
                  </button>
                </div>
                <p className="text-gray-700 mb-4">{post.content}</p>

                {/* comments sec */}
                <div className="mt-4 border-t pt-4">
                  <h3 className="text-lg font-semibold mb-4">Comments ({post.comments.length})</h3>
                  <div className="space-y-4">
                  {post.comments.filter(comment => !comment.parent).map((comment) => (
  <div key={comment.id} className="bg-gray-50 rounded p-4 mb-4">
    <div className="flex justify-between items-start mb-2">
      <span className="font-medium">{comment.user}</span>
      <span className="text-sm text-gray-500">{formatDate(comment.created_at)}</span>
    </div>
    
    <p className="text-gray-700">{comment.content}</p>

    {/* reply button */}
    <button
  onClick={() => {
    setActiveCommentId(comment.id); 
    setActivePostId(null); 
  }}
  className="text-blue-500 hover:underline mt-2"
>
  Reply
    </button>
     
    <button
                    onClick={() => {
                      setReportedCommentId(comment.id);
                      
                      setShowReportModal(true);
                    }}
                    className="text-red-500 hover:text-red-600 ml-5"
                  >
                    Report
                  </button>
   

    {/* show reply form */}
    {activeCommentId === comment.id && (
      <div className="mt-2 ml-6">
        <textarea
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
          placeholder="Write a reply..."
          className="w-full p-2 border rounded"
          rows="2"
        />
        <button
          onClick={() => handleAddComment(post.id, comment.id)}
          className="bg-green-500 text-white px-4 py-2 rounded mt-2"
        >
          Post Reply
        </button>
      </div>
    )}

    {/* display replies*/}
    {comment.replies.length > 0 && (
      <div className="mt-3 ml-6 border-l-4 border-gray-300 pl-3">
        {comment.replies.map((reply) => (
          <div key={reply.id} className="bg-gray-100 rounded p-3 mt-2">
            <div className="flex justify-between items-start mb-1">
              <span className="font-medium">{reply.user}</span>
              <span className="text-sm text-gray-500">{formatDate(reply.created_at)}</span>
            </div>
            <p className="text-gray-700">{reply.content}</p>
          </div>
        ))}
      </div>
    )}
  </div>
))}

                  </div>

                  {activePostId  === post.id ? (
                    <div className="mt-4">
                      <textarea
                        value={newComment}
                        onChange={(e) => setNewComment(e.target.value)}
                        placeholder="Write your comment..."
                        className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-[#4CAF50] focus:border-transparent"
                        rows="3"
                      />
                      <div className="flex justify-end gap-2 mt-2">
                        <button
                          onClick={() => setActiveCommentPost(null)}
                          className="px-4 py-2 text-gray-600 hover:text-gray-800"
                        >
                          Cancel
                        </button>
                        <button
                          onClick={() => handleAddComment(post.id)}
                          disabled={!newComment.trim()}
                          className="bg-[#4CAF50] text-white px-4 py-2 rounded hover:bg-[#45a049] disabled:bg-gray-300 disabled:cursor-not-allowed"
                        >
                          Post Comment
                        </button>
                      </div>
                    </div>
                  ) : (
                    <button
                      onClick={() => {
      setActivePostId(post.id); 
      setActiveCommentId(null); 
    }}
    className="mt-4 text-[#4CAF50] hover:text-[#45a049]"
  >
                      Add a comment
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
      {showNewPostModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg max-w-2xl w-full p-6">
            <h2 className="text-xl font-bold mb-4">Create New Post</h2>
            <form onSubmit={handleCreatePost}>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">Title</label>
                <input
                  type="text"
                  value={newPost.title}
                  onChange={(e) => setNewPost({ ...newPost, title: e.target.value })}
                  className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-[#4CAF50] focus:border-transparent"
                  required
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">Content</label>
                <textarea
                  value={newPost.content}
                  onChange={(e) => setNewPost({ ...newPost, content: e.target.value })}
                  className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-[#4CAF50] focus:border-transparent"
                  rows="4"
                  required
                />
              </div>
              <div className="flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowNewPostModal(false)}
                  className="px-4 py-2 text-gray-600 hover:text-gray-800"
                >
                  Cancel
                </button>
                <button type="submit" className="bg-[#4CAF50] text-white px-4 py-2 rounded hover:bg-[#45a049]">
                  Create Post
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
      {showReportModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg max-w-md w-full p-6">
            <h2 className="text-xl font-bold mb-4">Report Post</h2>
            <p className="text-gray-600 mb-4">Please select the reason for reporting this post:</p>
            <select 
            className="w-full px-3 py-2 border rounded-lg mb-4 focus:ring-2 focus:ring-[#4CAF50] focus:border-transparent"
            value={reportReason}
            onChange={(e)=>setReportReason(e.target.value)}>
              <option value="">Select a reason</option>
              <option value="spam">Spam</option>
              <option value="inappropriate">Inappropriate Content</option>
              <option value="harassment">Harassment</option>
              <option value="other">Other</option>
            </select>
            <textarea
              placeholder="Additional details (optional)"
              className="w-full px-3 py-2 border rounded-lg mb-4 focus:ring-2 focus:ring-[#4CAF50] focus:border-transparent"
              rows="3"
            />
            <div className="flex justify-end gap-2">
              <button onClick={() => setShowReportModal(false)} className="px-4 py-2 text-gray-600 hover:text-gray-800">
                Cancel
              </button>
              <button onClick={handleReport} className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600">
                Submit Report
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

    
 