import React, { useEffect, useState } from "react";
import Header from "../components/Header";
import Footer from "../components/Footer";
import "../App.css";
import ByEliLogo from "../assets/ByEli.png";
import { DarkMode } from "../components/DarkMode";
import { useNavigate } from "react-router-dom";
import API from '../api/axios';
import { useAuth } from '../context/AuthContext';
import Modal from '../components/Modal';

function HomePage() {
  useEffect(() => {
    DarkMode();
  }, []);
  const [modal, setModal] = useState({ show: false, message: '', type: '' });
const [deleteId, setDeleteId] = useState(null);
  const { user } = useAuth();
  const navigate = useNavigate();
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    API.get('/posts')
      .then(res => setPosts(res.data))
      .catch(err => console.error(err));
  }, []);

const handleDeletePost = async () => {
    try {
      await API.delete(`/posts/${deleteId}`);
      setPosts(posts.filter(p => p._id !== deleteId));
      setDeleteId(null);
      setModal({ show: true, message: 'Post deleted successfully! ✅', type: 'success' });
    } catch (err) {
      setModal({ show: true, message: 'Failed to delete post.', type: 'error' });
    }
};
 const handleLike = async (postId) => {
      if (!user) return;
      try {
        const res = await API.put(`/posts/${postId}/like`);
        setPosts(posts.map(p =>
          p._id === postId ? { ...p, likes: res.data.likes } : p
        ));
      } catch (err) {
        console.error(err);
      }
    };

  return (
    <>
      <Header />

      {modal.show && (
        <Modal
          message={modal.message}
          type={modal.type}
          onClose={() => setModal({ show: false, message: '', type: '' })}
        />
      )}

      {deleteId && (
        <div className="modal-overlay" onClick={() => setDeleteId(null)}>
          <div className="modal-box" onClick={(e) => e.stopPropagation()}>
            <div className="modal-icon">🗑️</div>
            <h3 className="modal-title error">Delete Post</h3>
            <p className="modal-message">Are you sure you want to delete this post?</p>
            <div className="logout-modal-btns">
              <button className="delete-btn" onClick={handleDeletePost}>Yes, Delete</button>
              <button className="edit-btn" onClick={() => setDeleteId(null)}>Cancel</button>
            </div>
          </div>
        </div>
      )}
      <button id="modeToggle">🌙</button>

      <section className="hero1">
        <div className="hero-text">
          <h1>Hi, I'm Elija</h1>
          <h2>Computer Science Student</h2>
        </div>
        <div className="hero-image">
          <img src={ByEliLogo} alt="ByEli Logo" />
        </div>
      </section>

      <div className="line"></div>

      <section id="hero">
        <h2>Welcome to ByEli</h2>
        <br />
        <p>This website showcases my skills, projects, and personal information.</p>
      </section>

      <div className="line"></div>

      <section id="section1">
        <h3>Key Highlights</h3>
        <ul>
          <li>
            Introduction about myself
            <p>A simple look at who I am, where I started, and what I love doing.</p>
          </li>
          <li>
            My skills and interests
            <p>Tools I've learned to use, like video editing and web design.</p>
          </li>
          <li>
            Sample projects and works
            <p>Screenshots of my best edits and favorite projects.</p>
          </li>
          <li>
            Ways to contact me
            <p>Social media links and a message form here.</p>
          </li>
        </ul>
      </section>

      <div className="sections-row">
        <section id="section2">
          <h3>About Me</h3>
          <br />
          <p>This is where I share my journey as a video editor...</p>
          <br />
          <p><a href="/about">Read more about me →</a></p>
        </section>

        <section id="section3">
          <h3>Contact</h3>
          <br />
          <p>Find out how to reach me for editing projects or collaborations...</p>
          <br />
          <p><a href="/contact">Contact Us →</a></p>
        </section>

        <section id="section4">
          <h3>Register</h3>
          <br />
          <p>Sign up to stay updated on my latest editing projects.</p>
          <br />
          <p><a href="/register">Register to get more updates →</a></p>
        </section>
      </div>

      <div className="line"></div>

      {/* BLOG POSTS */}
      <section className="posts-section">
        <div className="posts-header">
          <h2>Latest Posts</h2>
          {user && (
            <button className="submit-btn" onClick={() => navigate('/create-post')}>
              + New Post
            </button>
          )}
        </div>

        {posts.length === 0 ? (
          <p className="no-posts">No posts yet. Be the first to post! 😊</p>
        ) : (
          <div className="posts-grid">
            {posts.map((post) => (
              <div className="post-card" key={post._id}>
                {post.image && (
                  <img
                    src={`http://localhost:5000/uploads/${post.image}`}
                    alt={post.title}
                    className="post-card-image"
                  />
                )}
                <div className="post-card-body">
                  <h3>{post.title}</h3>
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
                    <span
                      className="post-author-link"
                      onClick={() => user && (user._id === post.author?._id || user.id === post.author?._id)
                        ? navigate('/profile')
                        : navigate(`/user/${post.author?._id}`)
                      }
                    >
                      {post.author?.name}
                    </span>
                    <span> · {new Date(post.createdAt).toLocaleDateString()}</span>
                  </div>
                  <p className="post-excerpt">{post.body.substring(0, 100)}...</p>
                  <div className="post-card-actions">
                    <button className="main-btn" onClick={() => navigate(`/post/${post._id}`)}>Read More</button>
                    {user ? (
                        <button
                          className={`like-btn ${post.likes?.includes(user._id) || post.likes?.includes(user.id) ? 'liked' : ''}`}
                          onClick={() => handleLike(post._id)}
                        >
                          ❤️ {post.likes?.length || 0}
                        </button>
                      ) : (
                        <span className="like-count">❤️ {post.likes?.length || 0}</span>
                      )}
                    {user && (user._id === post.author?._id || user.id === post.author?._id || user.role === 'admin') && (
                      <>
                        <button className="edit-btn" onClick={() => navigate(`/edit-post/${post._id}`)}>Edit</button>
                        <button className="delete-btn" onClick={() => setDeleteId(post._id)}>Delete</button>
                      </>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
        {user && (
        <button
          className="fab-btn"
          onClick={() => navigate('/create-post')}
          title="Write a Post"
        >
          +
        </button>
      )}
      <Footer />
    </>
  );
}

export default HomePage;