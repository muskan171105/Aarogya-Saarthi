import "../../style.css";
import { useState } from "react";
import axios from "axios";
import { useNavigate } from 'react-router-dom';
import SideBar from "../../SideBar";

function AddStaff() {
  const navigate = useNavigate();
  const [error, setError] = useState(null);
  const token = localStorage.getItem('userId');

    const [formData, setFormData] = useState({
      emp_id: "",
      f_name: "",
      l_name: "",
      email: "",
      age: "",
      date: "",
      phone: "",
      gender: "Male",
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
        const response = await axios.post('https://jhu-techlions.onrender.com/add_staff', formData, {headers: {
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
    <>
      <SideBar />

      <section className="home-section">
        <div className="home-content">
        </div>

        <div className="form-container">
          <h2>Employee Registration</h2>
          <form action="#" method="post">
            <label htmlFor="emp_id">Employee ID:</label>
            <input type="text" id="emp_id" name="emp_id" required value={formData.emp_id} onChange={handleChange}/>
            
            <label htmlFor="first_name">First Name:</label>
            <input type="text" id="first_name" name="f_name" required value={formData.f_name} onChange={handleChange}/>
            
            <label htmlFor="last_name">Last Name:</label>
            <input type="text" id="last_name" name="l_name" required value={formData.l_name} onChange={handleChange}/>
            
            <label htmlFor="email">Email:</label>
            <input type="email" id="email" name="email" required value={formData.email} onChange={handleChange}/>
            
            <label htmlFor="gender">Gender:</label>
            <select id="gender" name="gender" required value={formData.gender} onChange={handleChange}>
              <option value="male">Male</option>
              <option value="female">Female</option>
              <option value="other">Other</option>
            </select>
            
            <label htmlFor="age">Age:</label>
            <input type="number" id="age" name="age" required value={formData.age} onChange={handleChange}/>
            
            <label htmlFor="date_of_employment">Date of Employment:</label>
            <input type="date" id="date" name="date" required value={formData.date} onChange={handleChange}/>
            
            <label htmlFor="phone_number">Phone Number:</label>
            <input type="tel" id="phone" name="phone" required value={formData.phone} onChange={handleChange}/>
            
            <button type="submit" onClick={HandleClick}>Submit</button>
            {error && <p style={{ color: 'red', marginTop: 10 }}>{error}</p>}
          </form>
        </div>
      </section>
    </>
  );
}

export default AddStaff;
