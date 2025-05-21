
import React from "react";
// import AdminDashboardSidebar from "../../components/AdminDashboardSidebar";
import { Outlet } from "react-router-dom";
import SearchBar from "../../components/SearchBar";
import StatsCards from "./StatsCards";
const AdminDashboard = () => {
  return (
 <>  <SearchBar />
  <div className="p-6 h-full">
      {/* <AdminDashboard Sidebar /> */}
      <h2 className="text-2xl font-bold">Welcome to the Admin Dashboard</h2>
    </div>
       <StatsCards />
  
    </> 
  );
};

export default AdminDashboard;
