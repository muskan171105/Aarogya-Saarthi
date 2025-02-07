import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import Home from './Pages/Home/Index';
import Dashboard from './Pages/Home/JHU Dashboard/Dashboard/Dashboard';
import Staff from './Pages/Home/JHU Dashboard/Staff/Staff';
import AddStaff from './Pages/Home/JHU Dashboard/Add staff/Add_staff';
import Add_patients from './Pages/Home/JHU Dashboard/Add patients/Add_patients';
import Add_resources from './Pages/Home/JHU Dashboard/Add resources/Add_resources';

function App() {
  
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/staff" element={<Staff />} />
        <Route path="/add_staff" element={<AddStaff />} />
        <Route path="/add_patient" element={<Add_patients />} />
        <Route path="/add_resources" element={<Add_resources />} />
        <Route path="*" element={<Navigate to="/" />} />
        
      </Routes> 
    </Router>
  );
}

export default App;