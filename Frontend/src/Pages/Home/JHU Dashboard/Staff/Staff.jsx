import "../../style.css";
import SideBar from "../../SideBar";
import axios from "axios";
import { useEffect, useState } from "react";  

function Staff() {


  const [employeeData, setEmployeeData] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Fetch users from the server
    axios
      .get("https://jhu-techlions.onrender.com/staff")
      .then((response) => {
        setEmployeeData(response.data);
        setError(null);
      })
      .catch((error) => {
        console.error("Error fetching users:", error);
        setError("Failed to fetch users.");
      });
  }, []);

  return (
    <div className="Home">
      <SideBar />

      <section className="home-section" >
        <div className="home-content">
        </div>

        {/* Employee Table */}
        <div className="table-container">
          <h2>Employee Records</h2>
          <table id="table_height">
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
                <th>Salary</th>
              </tr>
            </thead>
            <tbody>
              {employeeData.map((employee) => (
                <tr key={employee.emp_id}>
                  <td>{employee.emp_id}</td>
                  <td>{employee.first_name}</td>
                  <td>{employee.last_name}</td>
                  <td>{employee.email}</td>
                  <td>{employee.gender}</td>
                  <td>{employee.age}</td>
                  <td>{new Date(employee.date_of_employment).toLocaleDateString("en-GB")}</td>
                  <td>{employee.phone_number}</td>
                  <td>{employee.Salary.toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
          {error && <p style={{color: 'red'}}>{error}</p>}
        </div>
      </section>
    </div>
  );
}

export default Staff;