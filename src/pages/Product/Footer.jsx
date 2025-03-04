const Footer = () => {
    return (
      <footer className="footer">
        <div className="footer-containerFooter">
          <div className="footer-section">
            <h3>SadeShop</h3>
            <p>Your destination for style, creativity, and trends.</p>
          </div>
          <div className="footer-section">
            <h4>Quick Links</h4>
            <ul>
              <li><a href="#home">Home</a></li>
              <li><a href="#shop">Shop</a></li>
              <li><a href="#about">About</a></li>
              <li><a href="#contact">Contact</a></li>
            </ul>
          </div>
          <div className="footer-section">
            <h4>Contact Us</h4>
            <p>Email: info@sadeshop.com</p>
            <p>Phone: +123-456-7890</p>
            <p>Location: Jakarta, Indonesia</p>
          </div>
          <div className="footer-section">
            <h4>Follow Us</h4>
            <div className="social-icons">
              <a href="https://facebook.com" target="_blank" rel="noopener noreferrer">Facebook</a>
              <a href="https://twitter.com" target="_blank" rel="noopener noreferrer">Twitter</a>
              <a href="https://instagram.com" target="_blank" rel="noopener noreferrer">Instagram</a>
            </div>
          </div>
        </div>
        <div className="footer-bottom">
          <p>© 2025 SadeShop. All rights reserved.</p>
        </div>
      </footer>
    );
  };
  
  export default Footer;
  