
import React from "react";
import { Outlet } from "react-router-dom";
import SearchBar from "../../components/SearchBar";
import StatsCards from "./StatsCards";
import EventsCalendar from "../../components/EventsCalendar"

const AdminDashboard = () => {
  return (
 <>  <SearchBar />
  <div className="p-6 ">
       <StatsCards />
       <EventsCalendar />
    </div>
    <Outlet />
    </> 
  );
};

export default AdminDashboard;
