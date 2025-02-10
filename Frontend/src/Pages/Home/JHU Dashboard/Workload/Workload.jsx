import { useEffect, useState } from "react";
import "../../style.css";
import SideBar from "../../SideBar";
import axios from "axios";

function Workload() {
  const [patients, setPatients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    axios.get("http://127.0.0.1:3000/patients")  // Fetch data from Node.js server
      .then(response => {
        setPatients(response.data);  // Store data in state
        setLoading(false);
      })
      .catch(error => {
        setError(error.message);
        setLoading(false);
      });
  }, []);

  return (
    <div className="Home">
      <SideBar />
      <section className="home-section">
        <div className="home-content">
          <i className='bx bx-menu'></i>
          <h2>Patient Priority List</h2>

          {loading && <p>Loading patient data...</p>}
          {error && <p>Error: {error}</p>}

          {!loading && !error && (
            <table border="1">
              <thead>
                <tr>
                  <th>Patient ID</th>
                  <th>Name</th>
                  <th>Medical Condition</th>
                  <th>Admission Type</th>
                  <th>Room Number</th>
                  <th>Sepsis</th>
                  <th>Priority Score</th>
                </tr>
              </thead>
              <tbody>
                {patients.map((patient, index) => (
                  <tr key={index}>
                    <td>{patient["Patient ID"]}</td>
                    <td>{patient["Name"]}</td>
                    <td>{patient["Medical Condition"]}</td>
                    <td>{patient["Admission Type"]}</td>
                    <td>{patient["Room Number"]}</td>
                    <td>{patient["Sepsis"]}</td>
                    <td>{patient["Priority Score"]}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </section>
    </div>
  );
}

export default Workload;
