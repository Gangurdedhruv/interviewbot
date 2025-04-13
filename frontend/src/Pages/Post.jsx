import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { FaThumbsUp, FaBookmark, FaShare, FaArrowLeft, FaReply, FaUser } from 'react-icons/fa';
import NavBar from '@/components/Navbar';
import { getAllRepliesOfPost, getPostById } from '@/actions/commActions';

// API endpoints in your Express server:
// POST /api/posts/:id/replies - to add a new reply
// POST /api/replies/:id/vote - to vote on a reply
const Post = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [post, setPost] = useState(null);
  const [replies, setReplies] = useState([]);
  const [newReply, setNewReply] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [toasts, setToasts] = useState([]);

  // Custom toast function
  const showToast = (title, message, type = 'success') => {
    const id = Date.now();
    setToasts(prevToasts => [...prevToasts, { id, title, message, type }]);
    
    // Auto dismiss after 3 seconds
    setTimeout(() => {
      setToasts(prevToasts => prevToasts.filter(toast => toast.id !== id));
    }, 3000);
  };

  useEffect(() => {
    if (!id) return;

    const loadPostData = async () => {
      setIsLoading(true);
      try {
          setPost((await getPostById(id)).data);
          setReplies((await getAllRepliesOfPost(id)).data);
          setIsLoading(false);
      } catch (error) {
        console.error('Error loading post:', error);
        showToast('Error', 'Failed to load post data', 'danger');
        setIsLoading(false);
      }
    };
    loadPostData();
  }, [id, navigate]);

  const handleSubmitReply = (e) => {
    e.preventDefault();
    if (!newReply.trim()) {
      showToast('Error', 'Reply cannot be empty', 'danger');
      return;
    }

    // Create a new reply object
    const newReplyObj = {
      _id: Date.now(),
      content: newReply,
      userId: 'currentUser', // In a real app, get from user authentication
      date: 'just now', //remove while sending
      votes: 0
    };

    // In a real app, send to backend API
    // Example:
    // const postReply = async () => {
    //   try {
    //     const response = await axios.post(`/api/posts/${id}/replies`, newReplyObj);
    //     setReplies([...replies, response.data]);
    //     setNewReply('');
    //     showToast('Success', 'Your reply has been posted', 'success');
    //   } catch (error) {
    //     showToast('Error', 'Failed to post reply', 'danger');
    //   }
    // };
    // postReply();

    // Using mock approach for now
    setReplies([...replies, newReplyObj]);
    setNewReply('');
    showToast('Success', 'Your reply has been posted', 'success');
  };

  const handleVote = (replyId, direction) => {
    // In a real app, send vote to backend API
    // Example:
    // const submitVote = async () => {
    //   try {
    //     await axios.post(`/api/replies/${replyId}/vote`, { direction });
    //     // Then update the UI or refetch replies
    //   } catch (error) {
    //     showToast('Error', 'Failed to record vote', 'danger');
    //   }
    // };
    // submitVote();

    // Using mock approach for now
    setReplies(replies.map(reply => {
      if (reply._id === replyId) {
        return {
          ...reply,
          votes: direction === 'up' ? reply.votes + 1 : reply.votes - 1
        };
      }
      return reply;
    }));
    showToast('Success', `Vote ${direction === 'up' ? 'up' : 'down'} recorded`, 'success');
  };

  const handleGoBack = () => {
    navigate('/community');
  };

  if (isLoading) {
    return (
      <div className="min-vh-100 bg-light">
        <div className="container py-5">
          <div className="card">
            <div className="card-body text-center p-5">
              <div className="spinner-border text-primary" role="status" style={{ width: '3rem', height: '3rem', color: '#7209b7' }}>
                <span className="visually-hidden">Loading...</span>
              </div>
              <p className="mt-3">Loading post details...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!post) {
    return null;
  }

  return (
    <div className="min-vh-100 bg-light">
      {/* Toast Container */}
      <div className="toast-container position-fixed top-0 end-0 p-3" style={{ zIndex: 1050 }}>
        {toasts.map(toast => (
          <div key={toast.id} className={`toast show bg-${toast.type} text-white`} role="alert" aria-live="assertive" aria-atomic="true">
            <div className="toast-header">
              <strong className="me-auto">{toast.title}</strong>
              <button type="button" className="btn-close" onClick={() => setToasts(prev => prev.filter(t => t.id !== toast.id))}></button>
            </div>
            <div className="toast-body">
              {toast.message}
            </div>
          </div>
        ))}
      </div>

      <div className="container py-4">
        <div className="d-flex flex-column gap-4">
          {/* Back Button */}
          <button 
            className="btn btn-sm btn-outline-secondary align-self-start mb-2" 
            onClick={handleGoBack}
          >
            <FaArrowLeft className="me-2" /> Back to Community
          </button>

          {/* Post Card */}
          <div className="card">
            <div className="card-body">
              <h1 className="card-title h4 mb-3">{post.title}</h1>
              
              {/* Post metadata */}
              <div className="d-flex flex-wrap gap-2 mb-3">
                {post.tags.map((tag, idx) => (
                  <span key={idx} className="badge bg-light text-dark py-1 px-2">
                    {tag}
                  </span>
                ))}
              </div>
              
              {/* Post content */}
              <div className="card-text mb-4">
                <p>{post.content}</p>
              </div>
              
              {/* Post stats and actions */}
              <div className="d-flex justify-content-between align-items-center border-top pt-3">
                <div className="d-flex align-items-center gap-3">
                  <div className="d-flex align-items-center">
                    <FaThumbsUp className="text-secondary me-1" />
                    <span className="text-secondary">{post.votes}</span>
                  </div>
                  <div className="d-flex align-items-center">
                    <span className="text-secondary">{post.views} views</span>
                  </div>
                </div>
                <div className="d-flex align-items-center gap-3">
                  <button className="btn btn-sm btn-outline-secondary">
                    <FaBookmark className="me-1" /> Save
                  </button>
                  <button className="btn btn-sm btn-outline-secondary">
                    <FaShare className="me-1" /> Share
                  </button>
                </div>
              </div>
              
              {/* Post author */}
              <div className="d-flex justify-content-end align-items-center mt-3">
                <div className="small text-secondary">
                  <span className="me-2">asked {post.updatedAt}</span>
                  <span className="fw-medium">{post.userId}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Answers/Replies Section */}
          <div className="card">
            <div className="card-header d-flex justify-content-between align-items-center">
              <h2 className="h5 mb-0">{replies.length} Answers</h2>
              <div className="dropdown">
                <button className="btn btn-sm btn-outline-secondary dropdown-toggle" type="button" id="sortDropdown" data-bs-toggle="dropdown" aria-expanded="false">
                  Sort by
                </button>
                <ul className="dropdown-menu" aria-labelledby="sortDropdown">
                  <li><button className="dropdown-item">Votes</button></li>
                  <li><button className="dropdown-item">Newest</button></li>
                  <li><button className="dropdown-item">Oldest</button></li>
                </ul>
              </div>
            </div>
            <div className="card-body p-0">
              {replies.length > 0 ? (
                <div className="d-flex flex-column">
                  {replies.map((reply, index) => (
                    <div key={reply._id} className={`p-4 ${index < replies.length - 1 ? 'border-bottom' : ''}`}>
                      <div className="d-flex gap-3">
                        {/* Voting */}
                        <div className="d-flex flex-column align-items-center me-2">
                          <button 
                            className="btn btn-sm btn-link text-decoration-none" 
                            onClick={() => handleVote(reply._id, 'up')}
                          >
                            <FaThumbsUp />
                          </button>
                          <span className="fw-bold my-1">{reply.votes}</span>
                          <button 
                            className="btn btn-sm btn-link text-decoration-none" 
                            onClick={() => handleVote(reply._id, 'down')}
                          >
                            <FaThumbsUp style={{ transform: 'rotate(180deg)' }} />
                          </button>
                        </div>
                        
                        {/* Reply content */}
                        <div className="flex-grow-1">
                          <div className="mb-3">
                            <p>{reply.content}</p>
                          </div>
                          
                          {/* Reply metadata */}
                          <div className="d-flex justify-content-between align-items-center">
                            <div className="d-flex gap-2">
                              <button className="btn btn-sm btn-link text-decoration-none">
                                <FaReply className="me-1" /> Reply
                              </button>
                            </div>
                            <div className="small text-secondary">
                              <span className="me-2">answered {reply.updatedAt}</span>
                              <span className="fw-medium">{reply.userId}</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center p-5">
                  <p className="mb-0">No answers yet. Be the first to answer!</p>
                </div>
              )}
            </div>
          </div>

          {/* Add Reply Form */}
          <div className="card">
            <div className="card-header">
              <h3 className="h5 mb-0">Your Answer</h3>
            </div>
            <div className="card-body">
              <form onSubmit={handleSubmitReply}>
                <div className="mb-3">
                  <textarea 
                    className="form-control" 
                    rows="5" 
                    placeholder="Write your answer here..." 
                    value={newReply}
                    onChange={(e) => setNewReply(e.target.value)}
                    required
                  ></textarea>
                </div>
                <div className="d-flex justify-content-between align-items-center">
                  <small className="text-secondary">
                    <FaUser className="me-1" /> Posting as <span className="fw-medium">currentUser</span>
                  </small>
                  <button 
                    type="submit" 
                    className="btn btn-primary" 
                    style={{ backgroundColor: '#7209b7', borderColor: '#7209b7' }}
                  >
                    Post Your Answer
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Post;