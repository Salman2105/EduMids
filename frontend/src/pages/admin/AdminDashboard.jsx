
import React from "react";
import { Outlet } from "react-router-dom";
import SearchBar from "../../components/SearchBar";
import StatsCards from "./StatsCards";
import EventsCalendar from "../../components/EventsCalendar"

const AdminDashboard = () => {
  return (
 <>  
  <div className="p-6 p-6 bg-gradient-to-br from-blue-50 to-white">
    <SearchBar />
       <StatsCards />
       <EventsCalendar />
    </div>
    <Outlet />
    </> 
  );
};

export default AdminDashboard;
