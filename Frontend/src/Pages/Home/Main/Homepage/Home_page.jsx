import "./stylesheet.css";
import { Link } from "react-router-dom";

function Home_page() {
  return (
    <div className="background-image">
      <nav>
        <div className="logo">
          <a href="./Home_page.jsx">
            <img src="../src/assets/logo.png" alt="Hriday Tarni Logo" />
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
      <div className="h-text">
        <span>"Aarogya Saarthi"</span>
        <h1>Secure. Smart. Seamless. Healthcare.</h1>
        <br />
      </div>
    </div>
  );
}

export default Home_page;
