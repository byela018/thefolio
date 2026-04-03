import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Header from "../components/Header";
import Footer from "../components/Footer";
import "../App.css";
import { DarkMode } from "../components/DarkMode";
import API from '../api/axios';
import { useAuth } from '../context/AuthContext';
import Modal from '../components/Modal';

const EditPostPage = () => {
  useEffect(() => {
    DarkMode();
  }, []);
  const [modal, setModal] = useState({ show: false, message: '', type: '' });
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();

  const [title, setTitle] = useState('');
  const [body, setBody] = useState('');
  const [image, setImage] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    API.get(`/posts/${id}`)
      .then(res => {
        setTitle(res.data.title);
        setBody(res.data.body);
      })
      .catch(() => setError("Post not found."));
  }, [id]);

const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      const fd = new FormData();
      fd.append('title', title);
      fd.append('body', body);
      if (image) fd.append('image', image);

      await API.put(`/posts/${id}`, fd);
      setModal({ show: true, message: 'Post updated successfully! ✅', type: 'success' });
      setTimeout(() => {
        navigate(`/post/${id}`);
      }, 1500);
    } catch (err) {
      setModal({ show: true, message: err.response?.data?.message || 'Failed to update post', type: 'error' });
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
      <button id="modeToggle">🌙</button>

      <section id="hero-register">
        <h2>Edit Post</h2>
        <p>Update your post details.</p>
      </section>

      <div className="line"></div>

      <section id="create-post-container">
        <h3>Edit Post</h3>
        <form onSubmit={handleSubmit}>
          <label>Title:</label>
          <input
            type="text"
            placeholder="Post title"
            value={title}
            onChange={e => setTitle(e.target.value)}
            required
          />

          <label>Content:</label>
          <textarea
            rows="8"
            placeholder="Write your post here..."
            value={body}
            onChange={e => setBody(e.target.value)}
            required
          ></textarea>

          {user?.role === 'admin' && (
            <>
              <label>Change Cover Image (Admin only):</label>
              <input
                type="file"
                accept="image/*"
                onChange={e => setImage(e.target.files[0])}
              />
            </>
          )}

          {error && <span className="error-msg">{error}</span>}

          <div className="form-footer">
            <button type="submit" className="submit-btn">Update Post</button>
          </div>
        </form>
      </section>

      <Footer />
    </>
  );
};

export default EditPostPage;