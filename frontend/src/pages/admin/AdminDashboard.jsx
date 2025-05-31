
import React from "react";
import { Outlet } from "react-router-dom";
import SearchBar from "../../components/SearchBar";
import StatsCards from "./StatsCards";

const AdminDashboard = () => {
  return (
 <>  <SearchBar />
  <div className="p-6 h-full">
      <h2 className="text-2xl font-bold m-10">Welcome to the Admin Dashboard</h2>
       <StatsCards />
    </div>
    <Outlet />
    </> 
  );
};

export default AdminDashboard;
