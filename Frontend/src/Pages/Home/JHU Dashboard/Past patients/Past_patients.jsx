import "../../style.css"; 
import { useEffect, useState } from "react";
import axios from "axios";
import SideBar from "../../SideBar";

function PastPatient() {
  const [patientRecords, setpatientRecords] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Fetch users from the server
    axios
      .get("http://localhost:3000/past_patients")
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
      
      <SideBar/>

      <section className="home-section">
        <div className="home-content">
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
                <th>Billing Amount</th>
                <th>Room Number</th>
                <th>Admission Type</th>
                <th>Discharge Date</th>
                <th>Medication</th>
                <th>Test Results</th>
                {/* <th>Room Type</th> */}
              </tr>
            </thead>
            <tbody>
              {patientRecords.map((patient) => (
                <tr key={patient.id}>
                  <td>{patient['Patient ID']}</td>
                  <td>{patient.Name}</td>
                  <td>{patient.Age}</td>
                  <td>{patient.Gender}</td>
                  <td>{patient['Blood Type']}</td>
                  <td>{patient['Medical Condition']}</td>
                  <td>{patient['Date of Admission']}</td>
                  <td>{patient.Doctor}</td>
                  <td>{patient['Insurance Provider']}</td>
                  <td>{patient['Billing Amount']}</td>
                  <td>{patient['Room Number']}</td>
                  <td>{patient['Admission Type']}</td>
                  <td>{patient['Discharge Date']}</td>
                  <td>{patient.Medication}</td>
                  <td>{patient['Test Results']}</td>
                  {/* <td>{patient.roomType}</td> */}
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

export default PastPatient;