
import React from "react";
// import TeacherDashboardSidebar from "../../components/TeacherDashboardSidebar";
import SearchBar from "../../components/SearchBar";
import TeacherStatsCards from "./TeacherStatsCards";

const TeacherDashboard = () => {
  return (
  <>  <div className="p-6 h-full">
      {/* <TeacherDashboardSidebar /> */}
      <SearchBar />
      <h2 className="text-2xl font-bold">Welcome to the Teacher Dashboard</h2>
    </div>
    <TeacherStatsCards />
    </>
  );
};

export default TeacherDashboard;
