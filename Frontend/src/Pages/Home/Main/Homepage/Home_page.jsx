import "./stylesheet.css";

function Home() {
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
            <a href="./Home_page.jsx">Home</a>
            <a href="../About_Page/About_Page.jsx">About</a>
            <a href="../Services_page/Services.jsx">Services</a>
            <a href="../Contact us/Contactus_page.jsx">Contact Us</a>
          </div>
        </div>
        <div className="register">
          <a href="#">Login</a>
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

export default Home;
