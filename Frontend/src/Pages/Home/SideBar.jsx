import { useEffect } from "react";
import "./style.css";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import axios from "axios";

function SideBar(){
  const navigate = useNavigate();
  useEffect(() => {
    const verifyUser = async () => {
      try {
        const token = localStorage.getItem("userId");
        
        if (!token) {
          console.error("No token found");
          navigate("/"); // Redirect to login page
          return;
        }
  
        const response = await axios.get("http://localhost:3000/auth", {
          headers: { Authorization: `Bearer ${token}` },
        });
  
        console.log("Verification successful:", response.data);
      } catch (error) {
        console.error("Error verifying user:", error);
        navigate("/"); // Redirect to login page
      }
    }
    verifyUser();
  });

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

      const HandleLogout = () =>{
        localStorage.removeItem('userId');
        window.location.href = '/';
      }
    
    return (
        <>
                <div className="sidebar close">
        <div className="logo-details">
          <img className="logo-img" src="../src/assets/logo.png" alt="Logo" />
          <span className="logo_name">Aarogya Saarthi</span>
        </div>
        
        <ul className="nav-links">
          <li>
            <Link to="/dashboard">
              <i className='bx bx-grid-alt'></i>
              <span className="link_name">Dashboard</span>
            </Link>
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
            <li><Link to="/staff">Display Staff</Link></li>
            <li><Link to="/add_staff">Add new</Link></li>
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
              <li><Link to="/add_patient">Add new</Link></li>
              <li><Link to="/patients">Current Patient</Link></li>
              <li><Link to="/past_patients">Past Patient</Link></li>
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
              <li><Link to="/resources">Currently available</Link></li>
              <li><Link to="/add_resources">Add Resources</Link></li>
              <li><Link to="/beds_requirement">Beds requirement</Link></li>
              <li><Link to="/ventilator_requirements">Ventilator requirement</Link></li>
              <li><Link to="/ppe_kit_requirement">PPE Kit requirement</Link></li>
              <li><Link to="/diagnostic_equipments">Diagnostic Equipments</Link></li>
              <li><Link to="/prediction"> Medical Equipments</Link></li>
              <li><Link to="/bloodbank">Blood Bank</Link></li>
            </ul>
          </li>
          <li>
            <Link to="/workload">
              <i className='bx bxs-briefcase'></i>
              <span className="link_name">Workload</span>
            </Link>
          </li>
        </ul>
        
        <div className="logout">
          <Link to="/" onClick={HandleLogout}>
            <i className='bx bx-log-out'></i>
            <span className="link_name">Logout</span>
          </Link>
        </div>
      </div>  
        </>
    );
}

export default SideBar;