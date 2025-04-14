"use client"

import { useState, useEffect } from "react"
import Swal from "sweetalert2"
import { Search, Trash2, Flag, MessageSquare, Plus, X } from "lucide-react"
import { baseURL } from "./constants"

export default function ForumPage() {
  const handleError = (message) => {
    Swal.fire({
      icon: "error",
      title: "Oops...",
      text: message,
    })
  }

  const handleSuccess = (message) => {
    Swal.fire({
      icon: "success",
      title: "Success!",
      text: message,
    })
  }
  const [posts, setPosts] = useState([])
  const [filteredPosts, setFilteredPosts] = useState([])
  const [searchTerm, setSearchTerm] = useState("")
  const [showNewPostModal, setShowNewPostModal] = useState(false)
  const [showReportModal, setShowReportModal] = useState(false)
  const [reportedPostId, setReportedPostId] = useState(null)
  const [reportedCommentId, setReportedCommentId] = useState(null)
  const [reportReason, setReportReason] = useState("")
  const [reportDetails, setReportDetails] = useState("")
  const [newPost, setNewPost] = useState({ title: "", content: "" })
  const [newComment, setNewComment] = useState("")
  const [activePostId, setActivePostId] = useState(null)
  const [activeCommentId, setActiveCommentId] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const currentUserId = localStorage.getItem("userId")
  const [isDeleting, setIsDeleting] = useState(false)



  useEffect(() => {
    // Set current user ID from localStorage
 

    const token = localStorage.getItem("authToken")

    fetch(`${baseURL}/api/posts/`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Token ${token}`,
      },
    })
      .then((res) => {
        if (!res.ok) {
          throw new Error("Failed to fetch posts")
        }
        return res.json()
      })
      .then(async (data) => {
        const postsWithComments = await Promise.all(
          data.map(async (post) => {
            const res = await fetch(`${baseURL}/api/comments/?post_id=${post.id}`, {
              method: "GET",
              headers: {
                "Content-Type": "application/json",
                Authorization: `Token ${token}`,
              },
            })

            if (!res.ok) {
              console.warn(`Failed to fetch comments for post ${post.id}`)
              return { ...post, comments: [] }
            }

            const comments = await res.json()
            return { ...post, comments }
          }),
        )

        setPosts(postsWithComments)
        setFilteredPosts(postsWithComments)
        setLoading(false)
      })
      .catch((error) => console.error("Error fetching posts:", error))
  }, [])

  // Search functionality
  useEffect(() => {
    if (searchTerm.trim() === "") {
      setFilteredPosts(posts)
      return
    }

    const term = searchTerm.toLowerCase()
    const filtered = posts.filter((post) => {
      // Search in post title and content
      if (post.title.toLowerCase().includes(term) || post.content.toLowerCase().includes(term)) {
        return true
      }

      // Search in comments and replies
      const hasMatchingComment = post.comments.some((comment) => {
        if (comment.content.toLowerCase().includes(term)) {
          return true
        }

        // Check replies if they exist
        if (comment.replies && comment.replies.length > 0) {
          return comment.replies.some((reply) => reply.content.toLowerCase().includes(term))
        }

        return false
      })

      return hasMatchingComment
    })

    setFilteredPosts(filtered)
  }, [searchTerm, posts])

  const handleReport = () => {
    if (!reportReason) {
      handleError("Select a reason for reporting.")
      return
    }

    if (!reportDetails) {
      handleError("Please put details for reporting.")
      return
    }

    const reportData = {
      reason: reportReason,
      reported_by: localStorage.getItem("userId"),
      report_desc: reportDetails,
      post: "",
    }

    // If comment reported
    if (typeof reportedCommentId !== "undefined" && reportedCommentId !== null) {
      reportData.comment = reportedCommentId
    }
    // If post reported
    else if (typeof reportedPostId !== "undefined" && reportedPostId !== null) {
      reportData.post = reportedPostId
    } else {
      handleError("Error: No post or comment selected.")
      return
    }

    fetch(`${baseURL}/api/reports/`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Token ${localStorage.getItem("authToken")}`,
      },
      body: JSON.stringify(reportData),
    })
      .then((res) => res.json())
      .then(() => {
        handleSuccess("Report submitted successfully.")
        setShowReportModal(false)
        setReportReason("")
        setReportDetails("")
      })
      .catch((error) => {
        console.error("Error submitting report:", error)
        handleError("Failed to submit report. Please try again.")
      })
  }

  const handleCreatePost = (e) => {
    e.preventDefault()
    setError("") // Clear previous error

    fetch(`${baseURL}/api/posts/`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Token ${localStorage.getItem("authToken")}`,
      },
      body: JSON.stringify({
        ...newPost,
        user: currentUserId
      })
    })
      .then(async (res) => {
        const data = await res.json() // Parse JSON response

        if (!res.ok) {
          throw new Error(data.error || "Failed to create post") // Handle validation errors
        }

        return data
      })
      .then((post) => {
        const newPostWithComments = { ...post, comments: [] }
        setPosts([newPostWithComments, ...posts])
        setFilteredPosts([newPostWithComments, ...filteredPosts])
        setNewPost({ title: "", content: "" })
        setShowNewPostModal(false)
      })
      .catch((error) => {
        setError(error.message) // Set error message in state
      })
  }

  // Add a comment to a post
  const handleAddComment = (postId, parentId = null) => {
    fetch(`${baseURL}/api/comments/`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Token ${localStorage.getItem("authToken")}`,
      },
      body: JSON.stringify({
        post: postId,
        content: newComment,
        parent: parentId,
        user: currentUserId, 
      }),
    })
      .then(async (res) => {
        if (!res.ok) {
          const errorData = await res.json()
          handleError(errorData.error)
          throw new Error(errorData.error || "Failed to add comment")
        }
        return res.json()
      })
      .then((comment) => {
        const updatePostComments = (postsList) => {
          return postsList.map((post) => {
            if (post.id === postId) {
              if (parentId) {
                // Adding a reply to a comment
                return {
                  ...post,
                  comments: post.comments.map((c) => {
                    if (c.id === parentId) {
                      return {
                        ...c,
                        replies: [...(c.replies || []), comment],
                      }
                    }
                    return c
                  }),
                }
              } else {
                // Adding a top-level comment
                return {
                  ...post,
                  comments: [...post.comments, comment],
                }
              }
            }
            return post
          })
        }

        setPosts(updatePostComments(posts))
        setFilteredPosts(updatePostComments(filteredPosts))
        setNewComment("")
        setActivePostId(null)
        setActiveCommentId(null)
      })
      .catch((error) => console.error("Error adding comment:", error))
  }

  // Delete a post
  const handleDeletePost = (postId) => {
    Swal.fire({
      title: "Are you sure?",
      text: "This action cannot be undone.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Yes, delete it!",
    }).then((result) => {
      if (result.isConfirmed) {
        setIsDeleting(true)

        fetch(`${baseURL}/api/posts/${postId}/`, {
          method: "DELETE",
          headers: {
            Authorization: `Token ${localStorage.getItem("authToken")}`,
          },
        })
          .then((res) => {
            if (!res.ok) {
              throw new Error("Failed to delete post")
            }

            // Remove the post from state
            const updatedPosts = posts.filter((post) => post.id !== postId)
            setPosts(updatedPosts)
            setFilteredPosts(updatedPosts)
            handleSuccess("Post deleted successfully")
          })
          .catch((error) => {
            console.error("Error deleting post:", error)
            handleError("Failed to delete post. Please try again.")
          })
          .finally(() => {
            setIsDeleting(false)
          })
      }
    })
  }

  // Delete a comment
  const handleDeleteComment = (commentId, postId, parentId = null) => {
    Swal.fire({
      title: "Delete this comment?",
      text: "This action cannot be undone",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Delete",
    }).then((result) => {
      if (result.isConfirmed) {
        setIsDeleting(true)

        fetch(`${baseURL}/api/comments/${commentId}/`, {
          method: "DELETE",
          headers: {
            Authorization: `Token ${localStorage.getItem("authToken")}`,
          },
        })
          .then((res) => {
            if (!res.ok) {
              throw new Error("Failed to delete comment")
            }

            // Update posts state to remove the deleted comment
            const updatePostsAfterCommentDelete = (postsList) => {
              return postsList.map((post) => {
                if (post.id === postId) {
                  if (parentId) {
                    // If it's a reply, remove it from the parent comment's replies
                    return {
                      ...post,
                      comments: post.comments.map((comment) => {
                        if (comment.id === parentId) {
                          return {
                            ...comment,
                            replies: comment.replies.filter((reply) => reply.id !== commentId),
                          }
                        }
                        return comment
                      }),
                    }
                  } else {
                    // If it's a top-level comment, remove it from comments
                    return {
                      ...post,
                      comments: post.comments.filter((comment) => comment.id !== commentId),
                    }
                  }
                }
                return post
              })
            }

            const updatedPosts = updatePostsAfterCommentDelete(posts)
            setPosts(updatedPosts)
            setFilteredPosts(updatePostsAfterCommentDelete(filteredPosts))
            handleSuccess("Comment deleted successfully")
          })
          .catch((error) => {
            console.error("Error deleting comment:", error)
            handleError("Failed to delete comment. Please try again.")
          })
          .finally(() => {
            setIsDeleting(false)
          })
      }
    })
  }

  const formatDate = (dateString) => {
    const options = { year: "numeric", month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" }
    return new Date(dateString).toLocaleDateString("en-US", options)
  }

  // Check if the current user is the author of a post or comment
  const isCurrentUserAuthor = (authorId) => {
 
    return currentUserId && authorId && currentUserId.toString() === authorId.toString()
  }

  return (
    <div className="min-h-screen bg-[#F8FBFF]">
      {/* <LoggedInHeader />*/}
      <div className="container mx-auto px-4 py-8 h-[90vh] overflow-y-auto">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
          <h1 className="text-2xl font-bold">Forum</h1>

          {/* Search bar */}
          <div className="relative w-full md:w-1/3 mb-4 md:mb-0">
            <input
              type="text"
              placeholder="Search posts and comments..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-[#4CAF50] focus:border-transparent"
            />
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            {searchTerm && (
              <button
                onClick={() => setSearchTerm("")}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          <button
            onClick={() => setShowNewPostModal(true)}
            className="bg-[#4CAF50] text-white px-4 py-2 rounded-lg hover:bg-[#45a049] transition-colors flex items-center whitespace-nowrap"
          >
            <Plus className="w-4 h-4 mr-1" />
            Create New Post
          </button>
        </div>

        {searchTerm && filteredPosts.length === 0 && !loading && (
          <div className="bg-white rounded-lg shadow-sm p-6 text-center">
            <p className="text-gray-500">No posts found matching "{searchTerm}"</p>
          </div>
        )}

        {loading ? (
          <p>Loading posts...</p>
        ) : (
          <div className="space-y-6">
            {filteredPosts.map((post) => (
              <div key={post.id} className="bg-white rounded-lg shadow-sm p-6">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h2 className="text-xl font-semibold mb-2">{post.title}</h2>
                    <div className="text-sm text-gray-500">
                      Posted by {post.username} • {formatDate(post.created_at)}
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    {isCurrentUserAuthor(post.user) && (
                      <button
                        onClick={() => handleDeletePost(post.id)}
                        disabled={isDeleting}
                        className="text-red-500 hover:text-red-600 p-1 rounded-full hover:bg-red-50"
                        title="Delete post"
                      >
                        <Trash2 className="w-5 h-5" />
                      </button>
                    )}
                    <button
                      onClick={() => {
                        setReportedPostId(post.id)
                        setReportedCommentId(null)
                        setShowReportModal(true)
                      }}
                      className="text-gray-500 hover:text-gray-600 p-1 rounded-full hover:bg-gray-50"
                      title="Report post"
                    >
                      <Flag className="w-5 h-5" />
                    </button>
                  </div>
                </div>
                <p className="text-gray-700 mb-4">{post.content}</p>

                {/* comments section */}
                <div className="mt-4 border-t pt-4">
                  <h3 className="text-lg font-semibold mb-4">
                    Comments ({post.comments.filter((comment) => !comment.parent).length})
                  </h3>
                  <div className="space-y-4">
                    {post.comments
                      .filter((comment) => !comment.parent)
                      .map((comment) => (
                        <div key={comment.id} className="bg-gray-50 rounded p-4 mb-4">
                          <div className="flex justify-between items-start mb-2">
                            <span className="font-medium">{comment.username}</span>
                            <div className="flex items-center space-x-2">
                              <span className="text-sm text-gray-500">{formatDate(comment.created_at)}</span>
                              {isCurrentUserAuthor(comment.user) && (
                                <button
                                  onClick={() => handleDeleteComment(comment.id, post.id)}
                                  disabled={isDeleting}
                                  className="text-red-500 hover:text-red-600 p-1 rounded-full hover:bg-red-50"
                                  title="Delete comment"
                                >
                                  <Trash2 className="w-4 h-4" />
                                </button>
                              )}
                            </div>
                          </div>

                          <p className="text-gray-700">{comment.content}</p>

                          <div className="flex items-center mt-2 space-x-3">
                            {/* reply button */}
                            <button
                              onClick={() => {
                                setActiveCommentId(comment.id)
                                setActivePostId(null)
                              }}
                              className="text-blue-500 hover:underline flex items-center"
                            >
                              <MessageSquare className="w-4 h-4 mr-1" />
                              Reply
                            </button>

                            <button
                              onClick={() => {
                                setReportedCommentId(comment.id)
                                setReportedPostId(null)
                                setShowReportModal(true)
                              }}
                              className="text-gray-500 hover:text-gray-600 flex items-center"
                            >
                              <Flag className="w-4 h-4 mr-1" />
                              Report
                            </button>
                          </div>

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
                              <div className="flex justify-end gap-2 mt-2">
                                <button
                                  onClick={() => setActiveCommentId(null)}
                                  className="px-3 py-1 text-gray-600 hover:text-gray-800"
                                >
                                  Cancel
                                </button>
                                <button
                                  onClick={() => handleAddComment(post.id, comment.id)}
                                  disabled={!newComment.trim()}
                                  className="bg-green-500 text-white px-3 py-1 rounded hover:bg-green-600 disabled:bg-gray-300 disabled:cursor-not-allowed"
                                >
                                  Post Reply
                                </button>
                              </div>
                            </div>
                          )}

                          {/* display replies*/}
                          {comment.replies && comment.replies.length > 0 && (
                            <div className="mt-3 ml-6 border-l-4 border-gray-300 pl-3">
                              {comment.replies.map((reply) => (
                                <div key={reply.id} className="bg-gray-100 rounded p-3 mt-2">
                                  <div className="flex justify-between items-start mb-1">
                                    <span className="font-medium">{reply.username}</span>
                                    <div className="flex items-center space-x-2">
                                      <span className="text-sm text-gray-500">{formatDate(reply.created_at)}</span>
                                      {isCurrentUserAuthor(reply.user) && (
                                        <button
                                          onClick={() => handleDeleteComment(reply.id, post.id, comment.id)}
                                          disabled={isDeleting}
                                          className="text-red-500 hover:text-red-600 p-1 rounded-full hover:bg-red-50"
                                          title="Delete reply"
                                        >
                                          <Trash2 className="w-3.5 h-3.5" />
                                        </button>
                                      )}
                                    </div>
                                  </div>
                                  <p className="text-gray-700">{reply.content}</p>
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                      ))}
                  </div>

                  {activePostId === post.id ? (
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
                          onClick={() => setActivePostId(null)}
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
                        setActivePostId(post.id)
                        setActiveCommentId(null)
                      }}
                      className="mt-4 text-[#4CAF50] hover:text-[#45a049] flex items-center"
                    >
                      <Plus className="w-4 h-4 mr-1" />
                      Add a comment
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Create Post Modal */}
      {showNewPostModal && (
        <div className="fixed inset-0 bg-white/30 backdrop-blur-md flex items-center justify-center z-50 transition-opacity duration-300">
          <div className="bg-white rounded-lg max-w-2xl w-full p-6">
            <h2 className="text-xl font-bold mb-4">Create New Post</h2>
            {error && <p style={{ color: "red" }}>Unable to create post ({error})</p>}
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

      {/* Report Modal */}
      {showReportModal && (
        <div className="fixed inset-0 bg-white/30 backdrop-blur-md flex items-center justify-center z-50 transition-opacity duration-300">
          <div className="bg-white rounded-lg max-w-md w-full p-6">
            <h2 className="text-xl font-bold mb-4">Report</h2>
            <p className="text-gray-600 mb-4">Please select the reason for reporting this content:</p>
            <select
              className="w-full px-3 py-2 border rounded-lg mb-4 focus:ring-2 focus:ring-[#4CAF50] focus:border-transparent"
              value={reportReason}
              onChange={(e) => setReportReason(e.target.value)}
            >
              <option value="">Select a reason</option>
              <option value="spam">Spam</option>
              <option value="inappropriate">Inappropriate Content</option>
              <option value="harassment">Harassment</option>
              <option value="other">Other</option>
            </select>
            <textarea
              value={reportDetails}
              onChange={(e) => setReportDetails(e.target.value)}
              placeholder="Additional details"
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
  )
}
