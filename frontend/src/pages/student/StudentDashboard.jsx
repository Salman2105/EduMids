
import React from "react";
import StudentDashboardSidebar from "../../components/StudentDashboardSidebar";
import SearchBar from "../../components/SearchBar";
import StudentSatsCards from "./StudentStatsCards";

const StudentDashboard = () => {
  return (
  <>  <div className="p-6 h-full ">
      {/* <StudentDashboardSidebar /> */}
      <SearchBar />
      <h2 className="text-2xl font-bold">Welcome to the Student Dashboard</h2>   
    </div>
    <StudentSatsCards />
    </>
  );
};

export default StudentDashboard;
