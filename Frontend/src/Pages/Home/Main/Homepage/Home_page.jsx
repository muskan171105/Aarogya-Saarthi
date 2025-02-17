import "./stylesheet.css";
import { Link } from "react-router-dom";
import bgImage from "../../../../assets/medical-care.png"
import logo from "../../../../assets/logo.png"


function Home_page() {
  return (
    <div className="background-image" style={{backgroundImage: `linear-gradient(rgba(75, 73, 73, 0.893), rgba(255, 255, 255, 0.121)), url(${bgImage})` }}>
      <nav>
        <div className="logo">
          <a href="./Home_page.jsx">
            <img src={logo} alt="Hriday Tarni Logo" />
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
      <div className="h-text">
        <span>"Aarogya Saarthi"</span>
        <h1>Secure. Smart. Seamless. Healthcare.</h1>
        <br />
      </div>
    </div>
  );
}

export default Home_page;
