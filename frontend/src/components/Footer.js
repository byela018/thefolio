function Footer() {
  return (
    <footer className="footer">
      <div className="footer1">
        <div className="social-links">
          <a href="https://www.tiktok.com" target="_blank" rel="noreferrer">
            <img src="/assets/tiktokicon.png" alt="TikTok icon" /> <u>TikTok</u>
          </a>

          <a href="https://www.instagram.com" target="_blank" rel="noreferrer">
            <img src="/assets/instagramicon.png" alt="Instagram icon" /> <u>Instagram</u>
          </a>
        </div>
        <p id="email1">&#9993; <a href="mailto:someone@example.com">Send email</a></p>
      </div>
      <p>&copy; 2026 Portfolio</p>
    </footer>
  );
}

export default Footer;
