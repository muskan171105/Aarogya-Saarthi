import "./stylesheet.css";

function Home() {
  return (
    <div className="background-image">
      <nav>
        <div className="logo">
        <a href="../Homepage/Home_page.jsx">
           <img src="../src/assets/logo.png" alt="Hriday Tarni Logo" />
        </a>
        </div>
        <div className="nav-menu">
          <div className="menu">
            <a href="../Homepage/Home_page.jsx">Home</a>
            <a href="../About_Page/About_Page.jsx">About</a>
            <a href="./Services.jsx">Services</a>
            <a href="../Contact us/Contactus_page.jsx">Contact Us</a>
          </div>
        </div>
        <div className="register">
          <a href="#">Login</a>
        </div>
      </nav>
      <div className="Heart">
        <h1>Our Services</h1>
      </div>
      <div className="redbox">
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

export default Home;
