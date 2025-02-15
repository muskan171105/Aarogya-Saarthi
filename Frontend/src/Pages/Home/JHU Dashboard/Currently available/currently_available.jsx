import "../../style.css"; 
import { useEffect, useState } from "react";
import SideBar from "../../SideBar";
import axios from "axios";

function Resources() {

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
        </div>

        {/* Patient Table */}
        <div className="table-container">
          <h2>Resources Available</h2>
          <table>
            <thead>
              <tr>
                <th>ECG Machine</th>
                <th>Pulse Oximeter</th>
                <th>Thermometers</th>
                <th>BP monitors</th>
                <th>Electrocardiography</th>
                <th>Opthalmoscopes</th>
                <th>Otoscopes</th>
                <th>Bedside Monitors</th>
                <th>Dopplers</th>
                <th>Centrifuge</th>
                <th>Incubator</th>
                <th>Scales</th>
                <th>Binocular Loupes</th>
                <th>Diagnostic Sets</th>
                <th>Imagung Equipment</th>
                <th>Stethoscopes</th>
                <th>CT Scan machines</th>
                <th>MRI Machines</th>
                <th>Laboratory Analyzers</th>
                <th>Ultrasound Machines</th>
                <th>ESR Analyzer</th>
                <th>X-Ray Machines</th>
                <th>Forceps</th>
                <th>Retractors</th>
                <th>Scissors</th>
                <th>Dissecting forceps</th>
                <th>Surgical scissors</th>
                <th>Needle holders</th>
                <th>Surgical hooks</th>
                <th>Surgical retractors</th>
                <th>Clamps</th>
                <th>Suction</th>
                <th>Hemostats</th>
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

export default Resources;