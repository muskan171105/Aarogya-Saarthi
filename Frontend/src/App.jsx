import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import Home from './Pages/Home/Index';
import Dashboard from './Pages/Home/JHU Dashboard/Dashboard/Dashboard';
import Staff from './Pages/Home/JHU Dashboard/Staff/Staff';
import AddStaff from './Pages/Home/JHU Dashboard/Add staff/Add_staff';
import Add_patients from './Pages/Home/JHU Dashboard/Add patients/Add_patients';
import Add_resources from './Pages/Home/JHU Dashboard/Add resources/Add_resources';
import CurrentPatients from './Pages/Home/JHU Dashboard/Current patients/current_patients';
import PastPatient from './Pages/Home/JHU Dashboard/Past patients/Past_patients';
import Resources from './Pages/Home/JHU Dashboard/Currently available/currently_available';
import Prediction from './Pages/Home/JHU Dashboard/Prediction/Prediction';
import Workload from './Pages/Home/JHU Dashboard/Workload/Workload';

function App() {
  
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/add_staff" element={<AddStaff />} />
        <Route path="/add_patient" element={<Add_patients />} />
        <Route path="/add_resources" element={<Add_resources />} />
        <Route path="/patients" element={<CurrentPatients />} />
        <Route path="/past_patients" element={<PastPatient />} />
        <Route path="/staff" element={<Staff />} />
        <Route path="/resources" element={<Resources />} />
        <Route path="/prediction" element={<Prediction />} />
        <Route path="/workload" element={<Workload />} />
        <Route path="*" element={<Navigate to="/" />} />
        
      </Routes> 
    </Router>
  );
}

export default App;