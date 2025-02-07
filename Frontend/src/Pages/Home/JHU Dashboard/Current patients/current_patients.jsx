import "./style.css"; 
import { useEffect } from "react";

function Home() {
  useEffect(() => {
    const arrows = document.querySelectorAll(".arrow");
    for (let i = 0; i < arrows.length; i++) {
      arrows[i].addEventListener("click", (e) => {
        let arrowParent = e.target.parentElement.parentElement; // selecting main parent of arrow
        arrowParent.classList.toggle("showMenu");
      });
    }

    const sidebar = document.querySelector(".sidebar");
    const sidebarBtn = document.querySelector(".bx-menu");

    if (sidebarBtn) {
      sidebarBtn.addEventListener("click", () => {
        sidebar.classList.toggle("close");
      });
    }
  }, []);

  const patientRecords = [
    {
      id: "P001",
      name: "John Doe",
      age: 30,
      gender: "Male",
      bloodType: "A+",
      medicalCondition: "Diabetes",
      admissionDate: "2024-01-15",
      doctor: "Dr. Smith",
      insuranceProvider: "HealthCare Inc.",
      roomNumber: 101,
      admissionType: "Emergency",
      medication: "Insulin",
      testResults: "Normal",
      roomType: "Single"
    },
    {
      id: "P002",
      name: "Jane Smith",
      age: 25,
      gender: "Female",
      bloodType: "O-",
      medicalCondition: "Hypertension",
      admissionDate: "2024-02-05",
      doctor: "Dr. Adams",
      insuranceProvider: "MediCare",
      roomNumber: 202,
      admissionType: "Routine",
      medication: "Beta-blockers",
      testResults: "Elevated",
      roomType: "Double"
    }
  ];

  return (
    <div className="Home">
      <div className="sidebar close">
        <div className="logo-details">
          <img className="logo-img" src="../src/assets/logo.png" alt="Logo" />
          <span className="logo_name">Aarogya Saarthi</span>
        </div>

        <ul className="nav-links">
          <li>
            <a href="../Dashboard/Dashboard.jsx">
              <i className='bx bx-grid-alt'></i>
              <span className="link_name">Dashboard</span>
            </a>
          </li>
          <li>
            <div className="iocn-link">
              <a href="#">
                <i className='bx bxs-group'></i>
                <span className="link_name">Staff</span>
              </a>
              <i className='bx bxs-chevron-down arrow'></i>
            </div>
            <ul className="sub-menu">
              <li><a href="../Staff/Staff.jsx">Display Staff</a></li>
              <li><a href="../Add staff/Add_staff.jsx">Add new</a></li>
            </ul>
          </li>
          <li>
            <div className="iocn-link">
              <a href="#">
                <i className='bx bxs-face-mask'></i>
                <span className="link_name">Patient</span>
              </a>
              <i className='bx bxs-chevron-down arrow'></i>
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
                <i className='bx bx-store'></i>
                <span className="link_name">Resources</span>
              </a>
              <i className='bx bxs-chevron-down arrow'></i>
            </div>
            <ul className="sub-menu">
              <li><a href="../Currently available/currently_available.jsx">Currently available</a></li>
              <li><a href="../Add resources/Add_resources.jsx">Add Resources</a></li>
              <li><a href="../Beds requirement/Beds_requirement.jsx">Beds requirement</a></li>
              <li><a href="../Ventilator requirement/Ventilator_requirement.jsx">Ventilator requirement</a></li>
              <li><a href="../PPE Kit requirement/PPEKit_requirement.jsx">PPE Kit requirement</a></li>
              <li><a href="../Diagnostic Equipments/Diagnostic_Equipments.jsx">Diagnostic Equipments</a></li>
              <li><a href="../Prediction/Prediction.jsx"> Medical Equipments</a></li>
            </ul>
          </li>
          <li>
            <a href="../Workload/Workload.jsx">
              <i className='bx bxs-briefcase'></i>
              <span className="link_name">Workload</span>
            </a>
          </li>
        </ul>
        <div className="logout">
          <a href="#">
            <i className='bx bx-log-out'></i>
            <span className="link_name">Logout</span>
          </a>
        </div>
      </div>

      <section className="home-section">
        <div className="home-content">
          <i className='bx bx-menu'></i>
        </div>

        {/* Patient Table */}
        <div className="table-container">
          <h2>Patient Records</h2>
          <table>
            <thead>
              <tr>
                <th>Patient ID</th>
                <th>Name</th>
                <th>Age</th>
                <th>Gender</th>
                <th>Blood Type</th>
                <th>Medical Condition</th>
                <th>Date of Admission</th>
                <th>Doctor</th>
                <th>Insurance Provider</th>
                <th>Room Number</th>
                <th>Admission Type</th>
                <th>Medication</th>
                <th>Test Results</th>
                <th>Room Type</th>
              </tr>
            </thead>
            <tbody>
              {patientRecords.map((patient) => (
                <tr key={patient.id}>
                  <td>{patient.id}</td>
                  <td>{patient.name}</td>
                  <td>{patient.age}</td>
                  <td>{patient.gender}</td>
                  <td>{patient.bloodType}</td>
                  <td>{patient.medicalCondition}</td>
                  <td>{patient.admissionDate}</td>
                  <td>{patient.doctor}</td>
                  <td>{patient.insuranceProvider}</td>
                  <td>{patient.roomNumber}</td>
                  <td>{patient.admissionType}</td>
                  <td>{patient.medication}</td>
                  <td>{patient.testResults}</td>
                  <td>{patient.roomType}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}

export default Home;
