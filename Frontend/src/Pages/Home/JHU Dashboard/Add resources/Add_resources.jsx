import "./style.css";
import { useEffect } from "react";

function Home() {
  useEffect(() => {
    let arrows = document.querySelectorAll(".arrow");
    arrows.forEach((arrow) => {
      arrow.addEventListener("click", (e) => {
        let arrowParent = e.target.parentElement.parentElement;
        arrowParent.classList.toggle("showMenu");
      });
    });

    let sidebar = document.querySelector(".sidebar");
    let sidebarBtn = document.querySelector(".bx-menu");
    if (sidebarBtn) {
      sidebarBtn.addEventListener("click", () => {
        sidebar.classList.toggle("close");
      });
    }

    let dropdown = document.getElementById("dropdown");
    let inputContainer = document.getElementById("input-container");
    let addButton = document.getElementById("add-btn");

    if (dropdown) {
      dropdown.addEventListener("change", function () {
        var selectedOption = this.value;
        if (selectedOption !== "option1") {
          inputContainer.innerHTML = `
            <input type="text" placeholder="Enter value for ${selectedOption}" />
            <button>Add</button>
          `;
          inputContainer.style.display = "block";
          addButton.style.display = "inline-block";
        } else {
          inputContainer.style.display = "none";
          addButton.style.display = "none";
        }
      });
    }
  }, []);

  return (
    <>
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
              <a href="#" className="dropdown-toggle">
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
              <a href="#" className="dropdown-toggle">
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
              <a href="#" className="dropdown-toggle">
                <i className='bx bx-store'></i>
                <span className="link_name">Resources</span>
              </a>
              <i className='bx bxs-chevron-down arrow'></i>
            </div>
            <ul className="sub-menu">
              <li><a href="../Currently available/currently_available.jsx">Currently available</a></li>
              <li><a href="../Add resources/Add_resources.jsx">Add Resources</a></li>
              <li><a href="../Prediction/Prediction.jsx">Prediction</a></li>
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
        <div className="dropdown-container">
          <select className="dropdown" id="dropdown">
            <option value="option1">Select option</option>
            <option value="ECG Machine">ECG Machine</option>
            <option value="Pulse Oximeter">Pulse Oximeter</option>
            <option value="Thermometers">Thermometers</option>
            <option value="Blood Pressure monitors">Blood Pressure monitors</option>
            <option value="Electrocardiograph">Electrocardiography</option>
            <option value="Opthalmoscopes">Opthalmoscopes</option>
            <option value="Otoscopes">Otoscopes</option>
            <option value="Bedside Monitors">Bedside Monitors</option>
            <option value="Dopplers">Dopplers</option>
            <option value="Centrifuge">Centrifuge</option>
            <option value="Incubator">Incubator</option>
            <option value="Scales">Scales</option>
            <option value="Binocular Loupes">Binocular Loupes</option>
            <option value="Diagnostic Sets">Diagnostic Sets</option>
            <option value="Imagung Equipment">Imagung Equipment</option>
            <option value="Stethoscopes">Stethoscopes</option>
            <option value="CT Scan machines">CT Scan machines</option>
            <option value="MRI Machines">MRI Machines</option>
            <option value="Laboratory Analyzers">Laboratory Analyzers</option>
            <option value="Ultrasound Machine">Ultrasound Machines</option>
            <option value="ESR Analyzer">ESR Analyzer</option>
            <option value="X-Ray Machines">X-Ray Machines</option>
            <option value="Forceps">Forceps</option>
            <option value="Retractors">Retractors</option>
            <option value="Scissors">Scissors</option>
            <option value="Dissecting forceps">Dissecting forceps</option>
            <option value="Surgical scissors">Surgical scissors</option>
            <option value="Needle holders">Needle holders</option>
            <option value="Suction,surgical hooks">Surgical hooks</option>
            <option value="Surgical retractors">Surgical retractors</option>
            <option value="Clamps">Clamps</option>
            <option value="Suction">Suction</option>
            <option value="Hemostats">Hemostats</option>
          </select>
          <div className="input-container" id="input-container" style={{ display: "none" }}></div>
          <button className="add-btn" id="add-btn" style={{ display: "none" }}>Add</button>
        </div>
      </section>
    </>
  );
}

export default Home;
