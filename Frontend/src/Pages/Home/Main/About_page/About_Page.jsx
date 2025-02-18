import "./stylesheet.css";
import { Link } from "react-router-dom";
import logo from "../../../../assets/logo.png"
import mission from "../../../../assets/Photo1.jpeg"
import vission from "../../../../assets/Photo2.jpeg"
import muskan from "../../../../assets/Muskan.jpeg.jpg"
import sparsh from "../../../../assets/Sparsh.jpg"
import shorya from "../../../../assets/Shoraya.jpg"
import prarabdh from "../../../../assets/Prarabdh.jpg"
import pragalbh from "../../../../assets/Praghalb.jpg"

function AboutPage() {
  return (
    <div className="background-image" style={{ overflow: 'scroll' }}>
      <nav>
        <div className="logo">
          <Link to="/">
            <img src={logo} alt="Hriday Tarni Logo" style={{height: 150, width: 150, marginTop: 60, marginLeft: -30}}/>
          </Link>
        </div>
        <div className="nav-menu" id="navlenght">
          <div className="menu" style={{justifyContent: 'center', textAlign: 'center'}}>
            <Link to="/">Home</Link>
            <Link to="/about">About</Link>
            <Link to="/services">Services</Link>
            <Link to="/contact">Contact Us</Link>
          </div>
        </div>
        <div className="register">
          <Link to="/login">Login</Link>
        </div>
      </nav>
      <div className="about">
        <h1>About Us</h1>
      </div>
      <div className="redbox">
        <h1 className="Mission">Our Mission</h1>
        <div id="Heart1">
          <img src={mission} alt="Heart image 1" className="Heart1" />
        </div>
        <p id="p1">
          The mission of Aarogya Saarthi is to develop an advanced healthcare management
          platform that integrates Machine Learning, Blockchain, and the MERN stack to
          tackle key medical challenges. We are committed to enabling real-time situation
          management, improving interoperability, and ensuring secure data exchange. Our AI-
          powered automation streamlines hospital workflows, reduces information overload, and enhances
          coordination between healthcare professionals. By prioritizing data security and transparency, we
          empower patients with full control over their medical records. Through innovation, we strive to
          create a more efficient, patient-centered healthcare ecosystem that ensures timely, data-driven
          medical interventions and better health outcomes. We aim to uphold the highest standards of data security
          and privacy, ensuring every medical record remains immutable and accessible only to authorized personnel.
          By leveraging the latest advancements in technology, we are dedicated to making healthcare more efficient,
          transparent, and patient-centered. Ultimately, Aarogya Saarthi seeks to bridge the gap between technology
          and healthcare, building a future where innovation leads to better health outcomes, seamless medical experiences,
          and a safer world for all.
        </p>
        <h1 className="Vision">Our Vision</h1>
        <div id="Heart2">
          <img src={vission} alt="Heart image 2" className="Heart2" />
        </div>
        <p id="p2">
          The vision of Aarogya Saarthi is to transform healthcare through technology by
          creating a seamless, intelligent, and secure platform that enhances accessibility,
          efficiency, and transparency. We aim to bridge the gap between patients, medical
          professionals, and institutions with real-time data analytics, AI-driven insights,
          and blockchain-secured records. Our goal is to optimize resource allocation,
          eliminate communication barriers, and ensure data integrity for better patient
          care. By leveraging Machine Learning and blockchain, we aspire to build a
          decentralized, patient-centric system that fosters trust, reduces medical errors,
          and sets a new benchmark in digital healthcare, making quality medical services
          accessible to all. By continuously innovating and leveraging modern technologies,
          Aarogya Saarthi aspires to be the leading force in transforming the healthcare
          industry for a healthier, smarter, and more connected world.
        </p>
        <h1 className="Members">The Team</h1>
        <div className="members">
          <img src={muskan} alt="Muskan Srivastav" className="Photo" />
          <img src={sparsh} alt="Sparsh Sahni" className="Photo" />
          <img src={pragalbh} alt="Pragalbh Sharma" className="Photo" />
          <img src={shorya} alt="Shorya Pathak" className="Photo" />
          <img src={prarabdh} alt="Prarabhd Soni" className="Photo" />
        </div>
        <div className="name-section">
          <h1 className="name">Muskan Srivastav<br /></h1>
          <h1 className="name">Sparsh Sahni<br /></h1>
          <h1 className="name">Pragalbh Sharma<br /></h1>
          <h1 className="name">Shorya Pathak<br /></h1>
          <h1 className="name">Prarabdh Soni<br /></h1>
        </div>
      </div>
      <div className="footer">
        <p>&copy; 2025 Aarogya Saarthi. All rights reserved.</p>
      </div>
    </div>
  );
}

export default AboutPage;
