import "../../style.css"; 
import { useEffect, useState } from "react";
import SideBar from "../../SideBar";
import axios from "axios";

function Resources() {

  const [ResourcesRecords, setResourcesRecords] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Fetch users from the server
    axios
      .get("http://localhost:3000/all_resources")
      .then((response) => {
        setResourcesRecords(response.data);
        setError(null);
      })
      .catch((error) => {
        console.error("Error fetching users:", error);
        setError("Failed to fetch users.");
      });
  }, []);

  console.log(ResourcesRecords);
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
              {ResourcesRecords.map((resources) => (
                <tr key={resources._id}>
                  <td>{resources['ECG Machine']}</td>
                  <td>{resources['Pulse Oximeter']}</td>
                  <td>{resources['Thermometers']}</td>
                  <td>{resources['Blood Pressure monitors']}</td>
                  <td>{resources['Electrocardiography']}</td>
                  <td>{resources['Opthalmoscopes']}</td>
                  <td>{resources['Otoscopes']}</td>
                  <td>{resources['Bedside Monitors']}</td>
                  <td>{resources['Dopplers']}</td>
                  <td>{resources['Centrifuge']}</td>
                  <td>{resources['Incubator']}</td>
                  <td>{resources['Scales']}</td>
                  <td>{resources['Binocular Loupes']}</td>
                  <td>{resources['Diagnostic Sets']}</td>
                  <td>{resources['Imagung Equipment']}</td>
                  <td>{resources['Stethoscopes']}</td>
                  <td>{resources['CT Scan machines']}</td>
                  <td>{resources['MRI Machines']}</td>
                  <td>{resources['Laboratory Analyzers']}</td>
                  <td>{resources['Ultrasound Machines']}</td>
                  <td>{resources['ESR Analyzer']}</td>
                  <td>{resources['X-Ray Machines']}</td>
                  <td>{resources['Forceps']}</td>
                  <td>{resources['Retractors']}</td>
                  <td>{resources['Scissors']}</td>
                  <td>{resources['Dissecting forceps']}</td>
                  <td>{resources['Surgical scissors']}</td>
                  <td>{resources['Needle holders']}</td>
                  <td>{resources['Surgical hooks']}</td>
                  <td>{resources['Surgical retractors']}</td>
                  <td>{resources['Clamps']}</td>
                  <td>{resources['Suction']}</td>
                  <td>{resources['Hemostats']}</td>

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