import "./stylesheet.css";

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
            <a href="../Homepage/Home_page.jsx">Home</a>
            <a href="../About_Page/About_Page.jsx">About</a>
            <a href="../Services_page/Services.jsx">Services</a>
            <a href="./Contactus_page.jsx">Contact Us</a>
          </div>
        </div>
        <div className="register">
          <a href="#">Login</a>
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
