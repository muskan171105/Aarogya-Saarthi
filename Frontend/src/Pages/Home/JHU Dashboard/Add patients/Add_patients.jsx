import React, { useEffect } from "react";
import "./style.css"; // Import your CSS file here

function Home() {
  useEffect(() => {
    const arrow = document.querySelectorAll(".arrow");
    arrow.forEach((item) => {
      item.addEventListener("click", (e) => {
        const arrowParent = e.target.parentElement.parentElement; // Selecting main parent of arrow
        arrowParent.classList.toggle("showMenu");
      });
    }); 

    const sidebar = document.querySelector(".sidebar");
    const sidebarBtn = document.querySelector(".bx-menu");
    sidebarBtn.addEventListener("click", () => {
      sidebar.classList.toggle("close");
    });
  }, []);

  return (
    <div>
      <div className="sidebar close">
        <div className="logo-details">
          <img className="logo-img" src="../src/assets/logo.png" alt="Logo" />
          <span className="logo_name">Aarogya Saarthi</span>
        </div>
        <ul className="nav-links">
          <li>
            <a href="../Dashboard/Dashboard.jsx">
              <i className="bx bx-grid-alt"></i>
              <span className="link_name">Dashboard</span>
            </a>
          </li>
          <li>
            <div className="iocn-link">
              <a href="#">
                <i className="bx bxs-group"></i>
                <span className="link_name">Staff</span>
              </a>
              <i className="bx bxs-chevron-down arrow"></i>
            </div>
            <ul className="sub-menu">
              <li><a href="../Staff/Staff.jsx">Display Staff</a></li>
              <li><a href="../Add staff/Add_staff.jsx">Add new</a></li>
            </ul>
          </li>
          <li>
            <div className="iocn-link">
              <a href="#">
                <i className="bx bxs-face-mask"></i>
                <span className="link_name">Patient</span>
              </a>
              <i className="bx bxs-chevron-down arrow"></i>
            </div>
            <ul className="sub-menu">
              <li><a href="../Add patients/Add_patients.jsx">Add new</a></li>
              <li><a href="../Current patients/current_patients.jsx">Current Patient</a></li>
              <li><a href="../Past patients/Past_patients.jsx">Past Patient</a></li>
            </ul>
          </li>
          <li>
            <div className="iocn-link">
              <a href="#">
                <i className="bx bx-store"></i>
                <span className="link_name">Resources</span>
              </a>
              <i className="bx bxs-chevron-down arrow"></i>
            </div>
            <ul className="sub-menu">
              <li><a href="../Currently available/currently_available.jsx">Currently available</a></li>
              <li><a href="../Add resources/Add_resources.jsx">Add Resources</a></li>
              <li><a href="../Prediction/Prediction.jsx">Prediction</a></li>
            </ul>
          </li>
          <li>
            <a href="../Workload/Workload.jsx">
              <i className="bx bxs-briefcase"></i>
              <span className="link_name">Workload</span>
            </a>
          </li>
        </ul>
        <div className="logout">
          <a href="#">
            <i className="bx bx-log-out"></i>
            <span className="link_name">Logout</span>
          </a>
        </div>
      </div>

      <section className="home-section">
        <div className="home-content">
          <i className="bx bx-menu"></i>
        </div>

        <div className="form-container">
          <h2>Patient Registration</h2>
          <form action="#" method="POST">
            <label htmlFor="patient_id">Patient ID:</label>
            <input type="text" id="patient_id" name="patient_id" required />

            <label htmlFor="name">Name:</label>
            <input type="text" id="name" name="name" required />

            <label htmlFor="age">Age:</label>
            <input type="number" id="age" name="age" required />

            <label htmlFor="gender">Gender:</label>
            <select id="gender" name="gender" required>
              <option value="">Select</option>
              <option value="Male">Male</option>
              <option value="Female">Female</option>
              <option value="Other">Other</option>
            </select>

            <label htmlFor="blood_type">Blood Type:</label>
            <input type="text" id="blood_type" name="blood_type" required />

            <label htmlFor="medical_condition">Medical Condition:</label>
            <textarea id="medical_condition" name="medical_condition" required></textarea>

            <label htmlFor="admission_date">Date of Admission:</label>
            <input type="date" id="admission_date" name="admission_date" required />

            <label htmlFor="doctor">Doctor:</label>
            <input type="text" id="doctor" name="doctor" required />

            <label htmlFor="insurance_provider">Insurance Provider:</label>
            <input type="text" id="insurance_provider" name="insurance_provider" />

            <label htmlFor="room_number">Room Number:</label>
            <input type="text" id="room_number" name="room_number" required />

            <label htmlFor="admission_type">Admission Type:</label>
            <input type="text" id="admission_type" name="admission_type" required />

            <label htmlFor="medication">Medication:</label>
            <textarea id="medication" name="medication"></textarea>

            <label htmlFor="test_results">Test Results:</label>
            <textarea id="test_results" name="test_results"></textarea>

            <label htmlFor="room_type">Room Type:</label>
            <select id="room_type" name="room_type" required>
              <option value="">Select</option>
              <option value="General">General</option>
              <option value="Private">Private</option>
              <option value="ICU">ICU</option>
            </select>
            
            <button type="submit">Submit</button>
          </form>
        </div>
      </section>
    </div>
  );
}

export default Home;
