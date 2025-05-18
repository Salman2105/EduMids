import React from "react";
import { Routes, Route } from "react-router-dom";
import AuthLayout from "./layout/AuthLayout";
import Index from "./pages/index";
// import Dashboard from "./components/dashboard"; // Ensure this component exists
import "./index.css"; // Adjust the path as necessary
import Signup from "./pages/SignUp"; // Adjust the path as necessary
import Login from "./pages/Login";
// import Dashboard from './pages/Dashboard';
// import Students from './pages/Students';
// import Teachers from './pages/Teachers';




// 
function App() {
  return (
    <AuthLayout>
      <Routes>
        <Route path="/index" element={<Index />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/login" element={<Login />} />
        {/* <Route path="/Dashboard" element={<Dashboard />} />
        <Route path="/Students" element={<Students />} /> 
        <Route path="/teachers" element={<Teachers />} /> */}


      </Routes>
    </AuthLayout>
  );
}

export default App;
