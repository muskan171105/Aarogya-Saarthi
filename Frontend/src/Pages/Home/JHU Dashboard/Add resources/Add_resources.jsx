
import { useState } from "react";
import { useNavigate } from 'react-router-dom';
import axios from "axios";
import SideBar from "../../SideBar";
import "../../style.css";

function Add_resources() {

  const navigate = useNavigate();
  const [error, setError] = useState(null);
  const token = localStorage.getItem('userId');


  const [formData, setFormData] = useState({
    resources: "",
    quantity:"",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };


  const HandleClick = async (e) => {
    e.preventDefault();
    console.log(formData);
    try {
      const response = await axios.post('https://jhu-techlions.onrender.com/add_resources', formData, {headers: {
        'Authorization': `Bearer ${token}`,
      },});
      if (response.status == 200 ) {
          navigate('/dashboard');
      }
  } catch (error) {
    console.error('Error in Sign Up:', error);
  
    if (error.response) { 
      const statusCode = error.response.status;
  
      if (statusCode === 403) {
        alert("Session expired. Please log in again.");
        localStorage.removeItem('token'); 
        window.location.href = '/'; 
        return; 
      }
  
      if (statusCode === 400) {
        setError("Employee ID is already registered");
        return; 
      }
  
      setError(error.response.data); 
    } else {
      setError("An unexpected error occurred. Please try again.");
    }
  }
}

  return (
    <>
      <SideBar />
      <section className="home-section">
        <div className="dropdown-container">
          <select className="dropdown" id="dropdown" name="resources" required value={formData.resources} onChange={handleChange}>
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
          <input className="input-container" id="input-container" style={{ display: "none" }} required value={formData.quantity} onChange={handleChange} name="quantity"/>
          <button className="add-btn" id="add-btn" style={{ display: "none" }} onClick={HandleClick}>Add</button>
          {error && <p style={{ color: 'red', marginTop: 10 }}>{error}</p>}
        </div>
      </section>
    </>
  );
}

export default Add_resources;
