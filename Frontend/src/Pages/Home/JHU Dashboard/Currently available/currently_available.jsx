import "../../style.css";
import { useEffect, useState } from "react";
import SideBar from "../../SideBar";

function Resources() {


  return (
    <div className="Home">
      <SideBar />
      <section className="home-section">
        <div className="home-content">
          <i className='bx bx-menu'></i>
        </div>

        {/* Resource Table */}
        <div className="table-container">
          <h2>Available Resources</h2>
          <table>
            <thead>
              <tr>
                <th>ECG Machine</th>
                <th>Pulse Oximeter</th>
                <th>Thermometers</th>
                <th>BP Monitors</th>
                <th>Electrocardiography</th>
                <th>Ophthalmoscopes</th>
                <th>Otoscopes</th>
                <th>Bedside Monitors</th>
                <th>Dopplers</th>
                <th>Centrifuge</th>
                <th>Incubator</th>
                <th>Scales</th>
                <th>Binocular Loupes</th>
                <th>Diagnostic Sets</th>
                <th>Imaging Equipment</th>
                <th>Stethoscopes</th>
                <th>CT Scan Machines</th>
                <th>MRI Machines</th>
                <th>Laboratory Analyzers</th>
                <th>Ultrasound Machines</th>
                <th>ESR Analyzer</th>
                <th>X-Ray Machines</th>
                <th>Forceps</th>
                <th>Retractors</th>
                <th>Scissors</th>
                <th>Dissecting Forceps</th>
                <th>Surgical Scissors</th>
                <th>Needle Holders</th>
                <th>Surgical Hooks</th>
                <th>Surgical Retractors</th>
                <th>Clamps</th>
                <th>Suction</th>
                <th>Hemostats</th>
              </tr>
            </thead>
            <tbody>
              {resources.map((resource, index) => (
                <tr key={index}>
                  <td>{resource.ECGMachine}</td>
                  <td>{resource.PulseOximeter}</td>
                  <td>{resource.Thermometers}</td>
                  <td>{resource.BPMonitors}</td>
                  <td>{resource.Electrocardiography}</td>
                  <td>{resource.Ophthalmoscopes}</td>
                  <td>{resource.Otoscopes}</td>
                  <td>{resource.BedsideMonitors}</td>
                  <td>{resource.Dopplers}</td>
                  <td>{resource.Centrifuge}</td>
                  <td>{resource.Incubator}</td>
                  <td>{resource.Scales}</td>
                  <td>{resource.BinocularLoupes}</td>
                  <td>{resource.DiagnosticSets}</td>
                  <td>{resource.ImagingEquipment}</td>
                  <td>{resource.Stethoscopes}</td>
                  <td>{resource.CTScanMachines}</td>
                  <td>{resource.MRIMachines}</td>
                  <td>{resource.LaboratoryAnalyzers}</td>
                  <td>{resource.UltrasoundMachines}</td>
                  <td>{resource.ESRAnalyzer}</td>
                  <td>{resource.XRayMachines}</td>
                  <td>{resource.Forceps}</td>
                  <td>{resource.Retractors}</td>
                  <td>{resource.Scissors}</td>
                  <td>{resource.DissectingForceps}</td>
                  <td>{resource.SurgicalScissors}</td>
                  <td>{resource.NeedleHolders}</td>
                  <td>{resource.SurgicalHooks}</td>
                  <td>{resource.SurgicalRetractors}</td>
                  <td>{resource.Clamps}</td>
                  <td>{resource.Suction}</td>
                  <td>{resource.Hemostats}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}

export default Resources;
