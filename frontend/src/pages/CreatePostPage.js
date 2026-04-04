import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Header from "../components/Header";
import Footer from "../components/Footer";
import "../App.css";
import { DarkMode } from "../components/DarkMode";
import API from '../api/axios';
import { useAuth } from '../context/AuthContext';
import Modal from '../components/Modal';

const CreatePostPage = () => {
  useEffect(() => {
    DarkMode();
  }, []);

    const [modal, setModal] = useState({ show: false, message: '', type: '' });
  const navigate = useNavigate();
  const { user } = useAuth();

  const [title, setTitle] = useState('');
  const [body, setBody] = useState('');
  const [image, setImage] = useState(null);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      const fd = new FormData();
      fd.append('title', title);
      fd.append('body', body);
      if (image) fd.append('image', image);

      const { data } = await API.post('/posts', fd);
      setModal({ show: true, message: 'Post published successfully! 🎉', type: 'success' });
      setTimeout(() => {
        navigate(`/post/${data._id}`);
      }, 1500);
    } catch (err) {
      setModal({ show: true, message: err.response?.data?.message || 'Failed to publish post', type: 'error' });
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
        <h2>Create a Post</h2>
        <p>Share your thoughts and projects!</p>
      </section>

      <div className="line"></div>

      <section id="create-post-container">
        <h3>New Post</h3>
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

          <label>Cover Image:</label>
          <input
            type="file"
            accept="image/*"
            onChange={e => setImage(e.target.files[0])}
          />

          {error && <span className="error-msg">{error}</span>}

          <div className="form-footer">
            <button type="submit" className="submit-btn">Publish Post</button>
          </div>
        </form>
      </section>

      <Footer />
    </>
  );
};

export default CreatePostPage;