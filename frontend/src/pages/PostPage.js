import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Header from "../components/Header";
import Footer from "../components/Footer";
import "../App.css";
import { DarkMode } from "../components/DarkMode";
import API from '../api/axios';
import { useAuth } from '../context/AuthContext';
import Modal from '../components/Modal';

const PostPage = () => {
  useEffect(() => {
    DarkMode();
  }, []);

  const { id } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();

  const [post, setPost] = useState(null);
  const [comments, setComments] = useState([]);
  const [commentText, setCommentText] = useState("");
  const [replyText, setReplyText] = useState("");
  const [replyingTo, setReplyingTo] = useState(null);
  const [error, setError] = useState("");
  const [modal, setModal] = useState({ show: false, message: '', type: '' });
  const [liked, setLiked] = useState(false);
  const [likesCount, setLikesCount] = useState(0);

  useEffect(() => {
  API.get(`/posts/${id}`)
    .then(res => {
      setPost(res.data);
      setLikesCount(res.data.likes?.length || 0);
      setLiked(res.data.likes?.includes(user?._id) || res.data.likes?.includes(user?.id));
    })
    .catch(() => setError("Post not found."));

  API.get(`/comments/${id}`)
    .then(res => setComments(res.data))
    .catch(err => console.error(err));
  }, [user, id]);

  const handleComment = async (e) => {
    e.preventDefault();
    if (!commentText.trim()) return;
    try {
      const res = await API.post(`/comments/${id}`, { body: commentText });
      setComments([...comments, { ...res.data, replies: [] }]);
      setCommentText("");
    } catch (err) {
      setModal({ show: true, message: 'Failed to post comment.', type: 'error' });
    }
  };

  const handleReply = async (e, parentId) => {
    e.preventDefault();
    if (!replyText.trim()) return;
    try {
      const res = await API.post(`/comments/${id}`, {
        body: replyText,
        parentComment: parentId,
      });
      setComments(comments.map(c =>
        c._id === parentId
          ? { ...c, replies: [...(c.replies || []), res.data] }
          : c
      ));
      setReplyText("");
      setReplyingTo(null);
    } catch (err) {
      setModal({ show: true, message: 'Failed to post reply.', type: 'error' });
    }
  };

  const handleDeleteComment = async (commentId, parentId = null) => {
    try {
      await API.delete(`/comments/${commentId}`);
      if (parentId) {
        setComments(comments.map(c =>
          c._id === parentId
            ? { ...c, replies: c.replies.filter(r => r._id !== commentId) }
            : c
        ));
      } else {
        setComments(comments.filter(c => c._id !== commentId));
      }
    } catch (err) {
      setModal({ show: true, message: 'Failed to delete comment.', type: 'error' });
    }
  };

  const handleLike = async () => {
  if (!user) return;
  try {
    const res = await API.put(`/posts/${id}/like`);
    setLiked(res.data.liked);
    setLikesCount(res.data.likes.length);
  } catch (err) {
    console.error(err);
  }
  };


  return (
    <>
      <Header />
      <button id="modeToggle">🌙</button>

      {modal.show && (
        <Modal
          message={modal.message}
          type={modal.type}
          onClose={() => setModal({ show: false, message: '', type: '' })}
        />
      )}

      {error ? (
        <section id="hero-register"><h2>{error}</h2></section>
      ) : post ? (
        <>
          <section id="post-container">
            {post.image && (
              <img
                src={`http://localhost:5000/uploads/${post.image}`}
                alt={post.title}
                className="post-image"
              />
            )}
            <h2>{post.title}</h2>

            {/* AUTHOR */}
            <div className="post-meta">
              {post.author?.profilePic ? (
                <img
                  src={`http://localhost:5000/uploads/${post.author.profilePic}`}
                  alt={post.author?.name}
                  className="post-author-pic"
                />
              ) : (
                <div className="post-author-avatar">
                  {post.author?.name?.charAt(0).toUpperCase()}
                </div>
              )}
              {user && (user._id === post.author?._id || user.id === post.author?._id) ? (
                <span className="post-author-link" onClick={() => navigate('/profile')}>
                  {post.author?.name}
                </span>
              ) : (
                <span>{post.author?.name}</span>
              )}
              <span> · {new Date(post.createdAt).toLocaleDateString()}</span>
            </div>

                        <div className="post-content">
              <p>{post.body}</p>
              {user ? (
                <button
                  className={`like-btn ${liked ? 'liked' : ''}`}
                  onClick={handleLike}
                >
                  ❤️ {likesCount} {liked ? 'Liked' : 'Like'}
                </button>
              ) : (
                <span className="like-count">❤️ {likesCount}</span>
              )}
            </div>
          </section>

          <div className="line"></div>

          {/* COMMENTS */}
          <section id="comments-container">
            <h3>Comments ({comments.length})</h3>

            {user && (
              <form onSubmit={handleComment} className="comment-form">
                <textarea
                  rows="3"
                  placeholder="Write a comment..."
                  value={commentText}
                  onChange={(e) => setCommentText(e.target.value)}
                ></textarea>
                <button type="submit" className="submit-btn">Post Comment</button>
              </form>
            )}

            {comments.length === 0 ? (
              <p className="no-comments">No comments yet. Be the first to comment!</p>
            ) : (
              comments.map((comment) => (
                <div className="comment-item" key={comment._id}>
                  {/* COMMENT AUTHOR */}
                  <div className="comment-author">
                    {comment.author?.profilePic ? (
                      <img
                        src={`http://localhost:5000/uploads/${comment.author.profilePic}`}
                        alt={comment.author?.name}
                        className="comment-author-pic"
                      />
                    ) : (
                      <div className="comment-author-avatar">
                        {comment.author?.name?.charAt(0).toUpperCase()}
                      </div>
                    )}
                    <div>
                    {user && (user._id === comment.author?._id || user.id === comment.author?._id) ? (
                      <strong className="post-author-link" onClick={() => navigate('/profile')}>
                        {comment.author?.name}
                      </strong>
                    ) : (
                      <strong>{comment.author?.name}</strong>
                    )}
                    <span className="comment-date"> · {new Date(comment.createdAt).toLocaleDateString()}</span>
                  </div>
                  </div>

                  <p className="comment-body">{comment.body}</p>

                  <div className="comment-actions">
                    {user && (
                      <button
                        className="reply-btn"
                        onClick={() => setReplyingTo(replyingTo === comment._id ? null : comment._id)}
                      >
                        💬 Reply
                      </button>
                    )}
                    {user && (user._id === comment.author?._id || user.role === 'admin') && (
                      <button className="delete-btn" onClick={() => handleDeleteComment(comment._id)}>
                        Delete
                      </button>
                    )}
                  </div>

                  {/* REPLY FORM */}
                  {replyingTo === comment._id && (
                    <form onSubmit={(e) => handleReply(e, comment._id)} className="reply-form">
                      <textarea
                        rows="2"
                        placeholder={`Reply to ${comment.author?.name}...`}
                        value={replyText}
                        onChange={(e) => setReplyText(e.target.value)}
                      ></textarea>
                      <div className="reply-form-btns">
                        <button type="submit" className="submit-btn">Post Reply</button>
                        <button type="button" className="edit-btn" onClick={() => setReplyingTo(null)}>Cancel</button>
                      </div>
                    </form>
                  )}

                  {/* REPLIES */}
                  {comment.replies && comment.replies.length > 0 && (
                    <div className="replies-container">
                      {comment.replies.map((reply) => (
                        <div className="reply-item" key={reply._id}>
                          <div className="comment-author">
                            {reply.author?.profilePic ? (
                              <img
                                src={`http://localhost:5000/uploads/${reply.author.profilePic}`}
                                alt={reply.author?.name}
                                className="comment-author-pic"
                              />
                            ) : (
                              <div className="comment-author-avatar">
                                {reply.author?.name?.charAt(0).toUpperCase()}
                              </div>
                            )}
                            <div>
                              {user && (user._id === reply.author?._id || user.id === reply.author?._id) ? (
                                <strong className="post-author-link" onClick={() => navigate('/profile')}>
                                  {reply.author?.name}
                                </strong>
                              ) : (
                                <strong>{reply.author?.name}</strong>
                              )}
                              <span className="comment-date"> · {new Date(reply.createdAt).toLocaleDateString()}</span>
                            </div>
                          </div>
                          <p className="comment-body">{reply.body}</p>
                          {user && (user._id === reply.author?._id || user.role === 'admin') && (
                            <button className="delete-btn" onClick={() => handleDeleteComment(reply._id, comment._id)}>
                              Delete
                            </button>
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ))
            )}
          </section>
        </>
      ) : (
        <section id="hero-register"><h2>Loading...</h2></section>
      )}

      <Footer />
    </>
  );
};

export default PostPage;