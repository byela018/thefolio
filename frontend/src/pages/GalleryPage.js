import React, { useState, useEffect } from "react";
import Header from "../components/Header";
import Footer from "../components/Footer";
import "../App.css";
import { DarkMode } from "../components/DarkMode";

import edit1 from "../assets/edit1.mp4";

const videos = [
  { id: 1, src: edit1, title: "Sa susunod nalang Hinata edit", description: "🎵 Song:Sa susunod nalang by Skusta Clee" },

];

const GalleryPage = () => {
  useEffect(() => {
    DarkMode();
  }, []);

  const [selectedVideo, setSelectedVideo] = useState(null);

  const openVideo = (video) => {
    setSelectedVideo(video);
  };

  const closeVideo = () => {
    setSelectedVideo(null);
  };

  return (
    <>
      <Header />
      <button id="modeToggle">🌙</button>

      <section id="hero-gallery">
        <h2>My Edits Gallery</h2>
        <p>Click a video to watch it! 🎬</p>
      </section>

      <div className="line"></div>

      <section className="gallery-grid">
        {videos.map((video) => (
            <div
            className="gallery-item"
            key={video.id}
            onClick={() => openVideo(video)}
            >
            <div className="gallery-thumbnail">
                <video src={video.src} muted />
                <span className="play-icon">▶</span>
            </div>
            <p>{video.title}</p>
            </div>
        ))}
      </section>

      <div className="line"></div>

      {/* MODAL */}
      {selectedVideo && (
        <div className="video-modal-overlay" onClick={closeVideo}>
          <div className="video-modal-content" onClick={(e) => e.stopPropagation()}>
            <button className="modal-close-btn" onClick={closeVideo}>✕</button>
            <h3>{selectedVideo.title}</h3>
            {selectedVideo.description && (
            <p className="video-description">{selectedVideo.description}</p>
            )}
            {selectedVideo.src ? (
              <video controls autoPlay controlsList="nodownload">
                <source src={selectedVideo.src} type="video/mp4" />
                Your browser does not support the video tag.
              </video>
            ) : (
              <div className="video-placeholder">
                <p>🎬 Video coming soon!</p>
              </div>
            )}
          </div>
        </div>
      )}

      <Footer />
    </>
  );
};

export default GalleryPage;