import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import Header from "../components/Header";
import Footer from "../components/Footer";
import "../App.css";
import { DarkMode } from "../components/DarkMode";
import API from '../api/axios';


const UserProfilePage = () => {
  useEffect(() => {
    DarkMode();
  }, []);

  const { id } = useParams();
  const [profile, setProfile] = useState(null);
  const [posts, setPosts] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    API.get(`/auth/user/${id}`)
      .then(res => setProfile(res.data))
      .catch(() => setError('User not found.'));

    API.get(`/posts`)
      .then(res => setPosts(res.data.filter(p => p.author?._id === id)))
      .catch(err => console.error(err));
  }, [id]);

  return (
    <>
      <Header />
      <button id="modeToggle">🌙</button>

      {error ? (
        <section id="hero-register"><h2>{error}</h2></section>
      ) : profile ? (
        <>
          <section id="profile-container">
            {/* PROFILE PIC */}
            <div style={{ textAlign: 'center', marginBottom: '20px' }}>
              {profile.profilePic ? (
                <img
                  src={profile.profilePic}
                  alt={profile.name}
                  style={{ width: '100px', height: '100px', borderRadius: '50%', objectFit: 'cover', border: '2px solid #CD2C58' }}
                />
              ) : (
                <div style={{
                  width: '100px', height: '100px', borderRadius: '50%',
                  backgroundColor: '#E06B80', border: '2px solid #CD2C58',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  margin: '0 auto', fontSize: '40px', color: '#ffffff', fontWeight: 'bold'
                }}>
                  {profile.name?.charAt(0).toUpperCase()}
                </div>
              )}
            </div>

            {/* PROFILE INFO */}
            <div id="profile-info">
              <h3>Profile</h3>
              <p><strong>Name:</strong> {profile.name}</p>
              <p><strong>Role:</strong> {profile.role}</p>
              {profile.bio && <p><strong>Bio:</strong> {profile.bio}</p>}
            </div>
          </section>

          <div className="line"></div>

          {/* USER POSTS */}
          <section className="posts-section">
            <div className="posts-header">
              <h2>Posts by {profile.name}</h2>
            </div>
            {posts.length === 0 ? (
              <p className="no-posts">No posts yet! 😊</p>
            ) : (
              <div className="posts-grid">
                {posts.map((post) => (
                  <div className="post-card" key={post._id}>
                    {post.image && (
                      <img
                        src={profile.profilePic}
                        alt={post.title}
                        className="post-card-image"
                      />
                    )}
                    <div className="post-card-body">
                      <h3>{post.title}</h3>
                      <p className="post-meta">{new Date(post.createdAt).toLocaleDateString()}</p>
                      <p className="post-excerpt">{post.body.substring(0, 100)}...</p>
                    </div>
                  </div>
                ))}
              </div>
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

export default UserProfilePage;