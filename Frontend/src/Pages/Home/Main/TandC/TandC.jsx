import { Link } from "react-router-dom";

function TMC() {
  return (
    <div style={{ 
      maxWidth: "800px", 
      margin: "40px auto", 
      padding: "20px", 
      backgroundColor: "#f9f9f9", 
      borderRadius: "10px", 
      boxShadow: "0px 4px 8px rgba(0, 0, 0, 0.1)",
      fontFamily: "Arial, sans-serif",
      color: "#333",
      height: "500px", 
      overflowY: "scroll",
      border: "1px solid #ddd"
    }}>
      <h1 style={{ textAlign: "center", color: "#222", fontSize: "28px", marginBottom: "20px" }}>
        Terms & Conditions
      </h1>
      
      <p style={{ fontSize: "16px", marginBottom: "15px" }}>
        Welcome to <strong>Aarogya Saarthi</strong>. By accessing or using the Software, you agree to abide by these Terms and Conditions. If you do not agree with any part of these terms, please do not use the Software.
      </p>
      
      <h2>1. Definitions</h2>
      <ul>
        <li><strong>Software:</strong> The healthcare management and monitoring system developed by [Your Team Name].</li>
        <li><strong>User:</strong> Any individual or entity accessing or using the Software.</li>
        <li><strong>We/Us/Our:</strong> The developers and operators of the Software.</li>
        <li><strong>Data:</strong> Any information collected, processed, or displayed within the Software.</li>
      </ul>
      
      <h2>2. Acceptance of Terms</h2>
      <p>By using the Software, you confirm that you have read, understood, and agreed to these Terms...</p>
      
      <h2>3. User Responsibilities</h2>
      <ul>
        <li>Users must provide accurate and lawful information when using the Software.</li>
        <li>Users shall not attempt to breach the security of the Software or access unauthorized data.</li>
      </ul>
      
      <h2>4. Data Privacy & Security</h2>
      <p>We prioritize data security but cannot guarantee absolute protection against cyber threats...</p>
      
      <h2>5. Prohibited Activities</h2>
      <ul>
        <li>Users must not use the Software for any unlawful or fraudulent activities.</li>
        <li>Users must not modify, decompile, reverse-engineer, or otherwise tamper with the Software.</li>
      </ul>
      
      <h2>6. Intellectual Property Rights</h2>
      <p>All content, trademarks, and software code within the Software are the property of [Your Team Name]...</p>
      
      <h2>7. Limitation of Liability</h2>
      <p>The Software is provided on an "AS-IS" basis, without warranties of any kind...</p>
      
      <h2>8. Termination</h2>
      <p>We reserve the right to terminate or restrict access to the Software at any time if a user is found violating these Terms...</p>
      
      <h2>9. Governing Law</h2>
      <p>These Terms are governed by the laws of [Your Country/State]...</p>
      
      <h2>10. Changes to Terms</h2>
      <p>We may update these Terms from time to time...</p>
      
      <div style={{ textAlign: "center", marginTop: "20px" }}>
        <Link to="/" 
          style={{
            textDecoration: "none",
            color: "white",
            backgroundColor: "#007BFF",
            padding: "10px 20px",
            borderRadius: "5px",
            fontSize: "16px",
            display: "inline-block",
            transition: "background 0.3s ease"
          }}
          onMouseOver={(e) => e.target.style.backgroundColor = "#0056b3"}
          onMouseOut={(e) => e.target.style.backgroundColor = "#007BFF"}
        >
          Back to Home
        </Link>
      </div>
    </div>
  );
}

export default TMC;
