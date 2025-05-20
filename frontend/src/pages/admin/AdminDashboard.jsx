
import React from "react";
// import AdminDashboardSidebar from "../../components/AdminDashboardSidebar";
import { Outlet } from "react-router-dom";
import SearchBar from "../../components/SearchBar";
import StatsCards from "../../components/StatsCards";
import Footer from "../Footer";
const AdminDashboard = () => {
  return (
 <>  <SearchBar /> <div className="p-6">
      {/* <AdminDashboard Sidebar /> */}
     
      <h2 className="text-2xl font-bold">Welcome to the Admin Dashboard</h2>
      <p>This area is for managing the entire platform, users, and reports.</p>
      <StatsCards />
    </div>
    <Footer />
    </> 
  );
};

export default AdminDashboard;
