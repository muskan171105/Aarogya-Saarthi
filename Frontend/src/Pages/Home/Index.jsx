import {useState} from "react";
import axios from "axios";
import { useNavigate } from 'react-router-dom';
import "./Index.css";
import {Link} from "react-router-dom"

function Home() {
  const navigate = useNavigate();
  const [error, setError] = useState(null);
  const [formData, setFormData] = useState({
    user: "",
    password: "",
  });

const [check, setCheck] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const HandleClick = async (e) => {
    e.preventDefault();
    // alert("Login clicked");
    setError(null);
    try {
        const response = await axios.post('https://jhu-techlions.onrender.com/login', formData);
        if (response.status == 200 || response.id) {
            localStorage.setItem('userId', response.data.token);
            navigate('/dashboard');
        }
    } catch (error) {
    console.error('Error Sign Up in', error);
    setError('Error in Login. Please try again later.');
    }
  }

const HandleCheck = () => {
  setCheck(!check);
}
  return (
    <div className="login-page">
      <div id="whitebox">
        <div id="name">
          <h1>Aarogya Saarthi</h1>
          <p>Empowering healthcare with real-time solutions, secure data, and smarter decisions</p>
        </div>
        <div className="form-box">
          <h2 className="login-heading">Log In</h2>
          <form id="login" className="input-group">
            <input type="text" className="input-field" placeholder="User id" required name="user" value={formData.user} onChange={handleChange}/>
            <input type="password" className="input-field" placeholder="Enter Password" required name="password" value={formData.password} onChange={handleChange}/>
            <div className="checkbox-container">
              <input type="checkbox" className="check-box" id="remember" name="checkbox" onClick={HandleCheck}/>
              <Link to="/policy" style={{color: 'black'}}>Term and Conditions</Link>
            </div>
            <button type="submit" className="submit-btn" onClick={HandleClick} disabled={check === false}>Log In</button>
            {error && <p style={{ color: 'red' }}>{error}</p>}
          </form>
        </div>
      </div>
    </div>
  );
}

export default Home;
