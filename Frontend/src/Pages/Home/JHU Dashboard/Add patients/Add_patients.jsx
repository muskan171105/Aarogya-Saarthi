import { useState } from "react";
import "../../style.css"; // Import your CSS file here
import axios from "axios";
import { useNavigate } from 'react-router-dom';
import SideBar from "../../SideBar";


function Add_patients() {

  const navigate = useNavigate();
  const [error, setError] = useState(null);
  const token = localStorage.getItem('userId');

  const [formData, setFormData] = useState({
    pat_id: "",
    name: "",
    age: "",
    blood_type:"",
    gender: "Male",
    medical_condition: "",
    doa: "",
    doctor: "",
    insurance: "",
    room_no: "",
    adm_type: "",
    medication: "",
    test_result: "",
    room_type: "",

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
      console.log(token);
      const response = await axios.post('https://localhost:3000/add_patient', formData, {headers: {
        'Authorization': `Bearer ${token}`,
      },});
      if (response.status == 200 ) {
          // localStorage.setItem('userId', response.data.id);
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
    <div>
      <SideBar />
      <section className="home-section">
        <div className="home-content">
        </div>

        <div className="form-container">
          <h2>Patient Registration</h2>
          <form action="#" method="POST">
            <label htmlFor="patient_id">Patient ID:</label>
            <input type="text" id="patient_id" name="pat_id" required value={formData.pat_id} onChange={handleChange}/>

            <label htmlFor="name">Name:</label>
            <input type="text" id="name" name="name" required value={formData.name} onChange={handleChange}/>

            <label htmlFor="age">Age:</label>
            <input type="number" id="age" name="age" required value={formData.age} onChange={handleChange}/>

            <label htmlFor="gender">Gender:</label>
            <select id="gender" name="gender" required value={formData.gender} onChange={handleChange}>
              <option value="Male">Male</option>
              <option value="Female">Female</option>
              <option value="Other">Other</option>
            </select>

            <label htmlFor="blood_type">Blood Type:</label>
            <input type="text" id="blood_type" name="blood_type" required value={formData.blood_type} onChange={handleChange}/>

            <label htmlFor="medical_condition">Medical Condition:</label>
            <textarea id="medical_condition" name="medical_condition" required value={formData.medical_condition} onChange={handleChange}></textarea>

            <label htmlFor="admission_date">Date of Admission:</label>
            <input type="date" id="admission_date" name="doa" required value={formData.doa} onChange={handleChange}/>

            <label htmlFor="doctor">Doctor:</label>
            <input type="text" id="doctor" name="doctor" required value={formData.doctor} onChange={handleChange}/>

            <label htmlFor="insurance_provider">Insurance Provider:</label>
            <input type="text" id="insurance_provider" name="insurance" value={formData.insurance} onChange={handleChange}/>

            <label htmlFor="room_number">Room Number:</label>
            <input type="text" id="room_number" name="room_no" required value={formData.room_no} onChange={handleChange}/>

            <label htmlFor="admission_type">Admission Type:</label>
            <input type="text" id="admission_type" name="adm_type" required value={formData.adm_type} onChange={handleChange}/>

            <label htmlFor="medication">Medication:</label>
            <textarea id="medication" name="medication" value={formData.medication} onChange={handleChange}></textarea>

            <label htmlFor="test_results">Test Results:</label>
            <textarea id="test_results" name="test_result" value={formData.test_result} onChange={handleChange}></textarea>

            <label htmlFor="room_type">Room Type:</label>
            <select id="room_type" name="room_type" required value={formData.room_type} onChange={handleChange}>
              <option value="">Select</option>
              <option value="General">General</option>
              <option value="Private">Private</option>
              <option value="ICU">ICU</option>
            </select>
            
            <button type="submit" onClick={HandleClick}>Submit</button>
            {error && <p style={{ color: 'red', marginTop: 10 }}>{error}</p>}
          </form>
        </div>
      </section>
    </div>
  );
}

export default Add_patients;
