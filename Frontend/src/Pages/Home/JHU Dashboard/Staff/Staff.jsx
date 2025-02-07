import "./style.css";
import { useEffect } from "react";

function Staff() {
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

  const employeeData = [
    {
      id: "EMP001",
      firstName: "John",
      lastName: "Doe",
      email: "john.doe@example.com",
      gender: "Male",
      age: 30,
      dateOfEmployment: "2020-01-15",
      phoneNumber: "123-456-7890"
    },
    {
      id: "EMP002",
      firstName: "Jane",
      lastName: "Smith",
      email: "jane.smith@example.com",
      gender: "Female",
      age: 28,
      dateOfEmployment: "2019-03-22",
      phoneNumber: "987-654-3210"
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

        {/* Employee Table */}
        <div className="table-container">
          <h2>Employee Records</h2>
          <table>
            <thead>
              <tr>
                <th>Employee ID</th>
                <th>First Name</th>
                <th>Last Name</th>
                <th>Email</th>
                <th>Gender</th>
                <th>Age</th>
                <th>Date of Employment</th>
                <th>Phone Number</th>
              </tr>
            </thead>
            <tbody>
              {employeeData.map((employee) => (
                <tr key={employee.id}>
                  <td>{employee.id}</td>
                  <td>{employee.firstName}</td>
                  <td>{employee.lastName}</td>
                  <td>{employee.email}</td>
                  <td>{employee.gender}</td>
                  <td>{employee.age}</td>
                  <td>{employee.dateOfEmployment}</td>
                  <td>{employee.phoneNumber}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}

export default Staff;