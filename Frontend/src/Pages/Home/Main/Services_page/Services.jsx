import "./stylesheet.css";
import { Link } from "react-router-dom";

function Services() {
  return (
    <div className="background-image" style={{overflow:'scroll'}}>
      <nav>
        <div className="logo">
        <a href="../Homepage/Home_page.jsx">
           <img src="../src/assets/logo.png" alt="Hriday Tarni Logo" />
        </a>
        </div>
        <div className="nav-menu" id="navlenght">
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
        <h1>Our Services</h1>
      </div>
      <div className="redbox" id="redbox1">
        <div className="service-card">
          <img src="../src/assets/Photo one.jpg" className="service-icon" alt="AI-Driven Insights" />
          <div className="service-content">
            <h1>AI-Driven Insights :</h1>
            <p>Minimizes manual interventions, enhances efficiency.</p>
          </div>
        </div>

        <div className="service-card">
          <img src="../src/assets/Photo two.jpg" className="service-icon" alt="Blockchain Integration" />
          <div className="service-content">
            <h1>Blockchain Integration :</h1>
            <p>Transparency and trust in supply chain validation.</p>
          </div>
        </div>

        <div className="service-card">
          <img src="../src/assets/Photo three.jpg" className="service-icon" alt="Scalable Backend" />
          <div className="service-content">
            <h1>Scalable Backend:</h1>
            <p>Smart, and robust backend, ensuring secure transfer of data.</p>
          </div>
        </div>

        <div className="service-card">
          <img src="../src/assets/Photo four.jpg" className="service-icon" alt="Holistic Design" />
          <div className="service-content">
            <h1>Holistic Design:</h1>
            <p>Combines patient management, resource tracking, and compliance.</p>
          </div>
        </div>
      </div>
      <div className="footer">
        <p>&copy; 2025 Aarogya Saarthi. All rights reserved.</p>
      </div>
    </div>
  );
}

export default Services;
