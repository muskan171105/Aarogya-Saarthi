import "../../style.css"; 
import { useEffect, useState } from "react";
import SideBar from "../../SideBar";
import axios from "axios";

function CurrentPatients() {

  const [patientRecords, setpatientRecords] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Fetch users from the server
    axios
      .get("http://localhost:3000/patients")
      .then((response) => {
        setpatientRecords(response.data);
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
                <tr key={patient.Patient}>
                  <td>{patient['Patient ID']}</td>
                  <td>{patient.Name}</td>
                  <td>{patient.Age}</td>
                  <td>{patient.Gender}</td>
                  <td>{patient['Blood Type']}</td>
                  <td>{patient['Medical Condition']}</td>
                  <td>{patient['Date of Admission']}</td>
                  <td>{patient.doctor}</td>
                  <td>{patient['Insurance Provider']}</td>
                  <td>{patient['Room Number']}</td>
                  <td>{patient['Admission Type']}</td>
                  <td>{patient['Medication']}</td>
                  <td>{patient['Test Results']}</td>
                  <td>{patient['Room type']}</td>
                </tr>
              ))}
            </tbody>
          </table>
          {error && <p style={{ color: 'red' }}>{error}</p>}
        </div>
      </section>
    </div>
  );
}

export default CurrentPatients;