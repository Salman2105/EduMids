import React from "react";
import DashboardSidebar from "../components/DashboardSidebar"; // Adjusted import path
import SearchBar from "../components/SearchBar"; // Adjusted import path
import StatsCards from "../components/StatsCards"; // Adjusted import path
// import EarningsChart from "../components/EarningsChart"; // Adjusted import path
// import AttendanceChart from "../components/AttendanceChart"; // Adjusted import path
// import TopPerformers from "../components/TopPerformers"; // Adjusted import path
// import EventsCalendar from "../components/EventsCalendar"; // Adjusted import path
import Students from "../components/Students"; 
import SignUp from "./SignUp"; 
import Login from "./Login";
import UserDashboardSidebar from "../components/UserDashboardSidebar";
import TeacherDashboardSidebar from "../components/TeacherDashboardSidebar"; // Adjusted import path
// import Courses from "./Courses"; // Adjusted import path
import Footer from "./Footer";

const Index = () => {
  return (
    <div className="flex min-h-screen bg-blue-50">
      {/* Sidebar */}
      <DashboardSidebar />

      {/* Main Content */}
      <main className="flex-1 p-6 overflow-auto">
        {/* Search Bar and User Profile */}
        <SearchBar />

        {/* Stats Cards */}
        <StatsCards />
        <Students />
        <SignUp />
        <Login />
       <UserDashboardSidebar />
        <TeacherDashboardSidebar />
        <Footer />
        {/* Top Performers Section */}            
        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
          {/* <EarningsChart /> */}
          {/* <AttendanceChart /> */}
        </div>

        {/* Bottom Section */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
           {/* <EventsCalendar /> */}
        </div>
      </main>
    </div>
  );
};

export default Index;
