import "./stylesheet.css";
import { Link } from "react-router-dom";

function ContactUs() {
  return (
    <div className="background-image">
      <nav>
        <div className="logo">
          <a href="../Homepage/Home_page.jsx">
            <img src="../src/assets/logo.png" alt="Aarogya Saarthi Logo" />
          </a>
        </div>
        <div className="nav-menu">
          <div className="menu">
          <Link to="/">Home</Link>
            <Link to="/about"> About</Link>
            <Link to="/services" >Services</Link>
            <Link to="/contact">Contact Us</Link>
          </div>
        </div>
        <div className="register">
        <Link to="/login">Login</Link>
        </div>
      </nav>
      
      <div className="Heart">
        <h1>Contact Us</h1>
      </div>

      <div className="redbox">
        <div className="contact-form">
          <h2>Get in Touch</h2>
          <form>
            <label htmlFor="name">Full Name</label>
            <input type="text" id="name" name="name" placeholder="Enter your name" required />

            <label htmlFor="email">Email</label>
            <input type="email" id="email" name="email" placeholder="Enter your email" required />

            <label htmlFor="message">Message</label>
            <textarea id="message" name="message" rows="5" placeholder="Write your message here..." required></textarea>

            <button type="submit">Submit</button>
          </form>
        </div>
      </div>

      <div className="footer">
        <p>&copy; 2025 Aarogya Saarthi. All rights reserved.</p>
      </div>
    </div>
  );
}

export default ContactUs;
