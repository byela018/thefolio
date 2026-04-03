import React, { useState, useEffect } from "react";
import Header from "../components/Header";
import Footer from "../components/Footer";
import "../App.css";
import { DarkMode } from "../components/DarkMode";
import API from '../api/axios';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import Modal from '../components/Modal';

const AdminPage = () => {
  useEffect(() => {
    DarkMode();
  }, []);
  const [modal, setModal] = useState({ show: false, message: '', type: '' });
  const [removeId, setRemoveId] = useState(null);
  const [messages, setMessages] = useState([]);
  const { user } = useAuth();
  const navigate = useNavigate();

  const [users, setUsers] = useState([]);
  const [posts, setPosts] = useState([]);
  const [tab, setTab] = useState('users');

  useEffect(() => {
    if (!user || user.role !== 'admin') {
      navigate('/');
      return;
    }
    API.get('/admin/users').then(r => setUsers(r.data));
    API.get('/admin/posts').then(r => setPosts(r.data));
    API.get('/messages').then(r => setMessages(r.data));
  }, [user, navigate]);

  const toggleStatus = async (id) => {
      try {
        const { data } = await API.put(`/admin/users/${id}/status`);
        setUsers(users.map(u => u._id === id ? data.user : u));
        setModal({ show: true, message: `User is now ${data.user.status}! ✅`, type: 'success' });
      } catch (err) {
        setModal({ show: true, message: 'Failed to update user status.', type: 'error' });
      }
  };

  const removePost = async () => {
      try {
        await API.put(`/admin/posts/${removeId}/remove`);
        setPosts(posts.map(p => p._id === removeId ? { ...p, status: 'removed' } : p));
        setRemoveId(null);
        setModal({ show: true, message: 'Post removed successfully! ✅', type: 'success' });
      } catch (err) {
        setModal({ show: true, message: 'Failed to remove post.', type: 'error' });
      }
  };

  const handleMarkRead = async (id) => {
    try {
      const { data } = await API.put(`/messages/${id}/read`);
      setMessages(messages.map(m => m._id === id ? data.data : m));
    } catch (err) {
      setModal({ show: true, message: 'Failed to mark as read.', type: 'error' });
    }
  };

  const handleDeleteMessage = async (id) => {
    try {
      await API.delete(`/messages/${id}`);
      setMessages(messages.filter(m => m._id !== id));
      setModal({ show: true, message: 'Message deleted! ✅', type: 'success' });
    } catch (err) {
      setModal({ show: true, message: 'Failed to delete message.', type: 'error' });
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

      {removeId && (
        <div className="modal-overlay" onClick={() => setRemoveId(null)}>
          <div className="modal-box" onClick={(e) => e.stopPropagation()}>
            <div className="modal-icon">🗑️</div>
            <h3 className="modal-title error">Remove Post</h3>
            <p className="modal-message">Are you sure you want to remove this post? It will no longer be visible to the public.</p>
            <div className="logout-modal-btns">
              <button className="delete-btn" onClick={removePost}>Yes, Remove</button>
              <button className="edit-btn" onClick={() => setRemoveId(null)}>Cancel</button>
            </div>
          </div>
        </div>
      )}
      <button id="modeToggle">🌙</button>

      <section id="hero-register">
        <h2>Admin Dashboard</h2>
        <p>Manage users and posts.</p>
      </section>

      <div className="line"></div>

      {/* TABS */}
      <div className="admin-tabs">
        <button
          onClick={() => setTab('users')}
          className={tab === 'users' ? 'submit-btn' : 'edit-btn'}
        >
          Members ({users.length})
        </button>
        <button
          onClick={() => setTab('posts')}
          className={tab === 'posts' ? 'submit-btn' : 'edit-btn'}
        >
          All Posts ({posts.length})
        </button>
        <button
          onClick={() => setTab('messages')}
          className={tab === 'messages' ? 'submit-btn' : 'edit-btn'}
        >
          Messages ({messages.filter(m => !m.isRead).length} unread)
        </button>
      </div>

      {/* USERS TAB */}
      {tab === 'users' && (
        <section className="admin-section">
          <h3>All Members</h3>
          <table className="admin-table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Email</th>
                <th>Status</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {users.length === 0 ? (
                <tr><td colSpan="4">No members found.</td></tr>
              ) : (
                users.map((u) => (
                  <tr key={u._id}>
                    <td>{u.name}</td>
                    <td>{u.email}</td>
                    <td>
                      <span className={`status-badge ${u.status}`}>
                        {u.status}
                      </span>
                    </td>
                    <td>
                      <button
                        className={u.status === 'active' ? 'delete-btn' : 'edit-btn'}
                        onClick={() => toggleStatus(u._id)}
                      >
                        {u.status === 'active' ? 'Deactivate' : 'Activate'}
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </section>
      )}

      {/* POSTS TAB */}
      {tab === 'posts' && (
        <section className="admin-section">
          <h3>All Posts</h3>
          <table className="admin-table">
            <thead>
              <tr>
                <th>Title</th>
                <th>Author</th>
                <th>Status</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {posts.length === 0 ? (
                <tr><td colSpan="4">No posts found.</td></tr>
              ) : (
                posts.map((p) => (
                  <tr key={p._id}>
                    <td>{p.title}</td>
                    <td>{p.author?.name}</td>
                    <td>
                      <span className={`status-badge ${p.status}`}>
                        {p.status}
                      </span>
                    </td>
                    <td>
                      {p.status === 'published' && (
                          <button
                            className="delete-btn"
                            onClick={() => setRemoveId(p._id)}
                          >
                            Remove
                          </button>
                        )}
                      
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </section>
      )}
      {tab === 'messages' && (
          <section className="admin-section">
            <h3>Contact Messages</h3>
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Message</th>
                  <th>Date</th>
                  <th>Status</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {messages.length === 0 ? (
                  <tr><td colSpan="6">No messages yet.</td></tr>
                ) : (
                  messages.map((m) => (
                    <tr key={m._id} style={{ backgroundColor: m.isRead ? '' : '#fff3f5' }}>
                      <td>{m.name}</td>
                      <td>{m.email}</td>
                      <td>{m.message}</td>
                      <td>{new Date(m.createdAt).toLocaleDateString()}</td>
                      <td>
                        <span className={`status-badge ${m.isRead ? 'active' : 'inactive'}`}>
                          {m.isRead ? 'Read' : 'Unread'}
                        </span>
                      </td>
                      <td style={{ display: 'flex', gap: '5px' }}>
                        {!m.isRead && (
                          <button className="edit-btn" onClick={() => handleMarkRead(m._id)}>
                            Mark Read
                          </button>
                        )}
                        <button className="delete-btn" onClick={() => handleDeleteMessage(m._id)}>
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </section>
        )}
      <div className="line"></div>

      <Footer />
    </>
  );
};

export default AdminPage;