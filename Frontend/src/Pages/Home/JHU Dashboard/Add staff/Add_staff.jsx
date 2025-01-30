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
    sidebarBtn.addEventListener("click", () => {
      sidebar.classList.toggle("close");
    });
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
        <div className="home-content">
          <i className='bx bx-menu'></i>
        </div>

        <div className="form-container">
          <h2>Employee Registration</h2>
          <form action="#" method="post">
            <label htmlFor="emp_id">Employee ID:</label>
            <input type="text" id="emp_id" name="emp_id" required />
            
            <label htmlFor="first_name">First Name:</label>
            <input type="text" id="first_name" name="first_name" required />
            
            <label htmlFor="last_name">Last Name:</label>
            <input type="text" id="last_name" name="last_name" required />
            
            <label htmlFor="email">Email:</label>
            <input type="email" id="email" name="email" required />
            
            <label htmlFor="gender">Gender:</label>
            <select id="gender" name="gender" required>
              <option value="male">Male</option>
              <option value="female">Female</option>
              <option value="other">Other</option>
            </select>
            
            <label htmlFor="age">Age:</label>
            <input type="number" id="age" name="age" required />
            
            <label htmlFor="date_of_employment">Date of Employment:</label>
            <input type="date" id="date_of_employment" name="date_of_employment" required />
            
            <label htmlFor="phone_number">Phone Number:</label>
            <input type="tel" id="phone_number" name="phone_number" required />
            
            <button type="submit">Submit</button>
          </form>
        </div>
      </section>
    </>
  );
}

export default Home;
