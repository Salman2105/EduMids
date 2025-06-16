
import React from "react";
import SearchBar from "../../components/SearchBar";
import TeacherStatsCards from "./TeacherStatsCards";
import TeacherCalendar from "./TeacherCalendar";

const TeacherDashboard = () => {
  return (
  <>  <div className="p-6 p-6 bg-gradient-to-br from-blue-50 to-white">
      <SearchBar />
      <h2 className="mt-12 mb-6  text-3xl md:text-4xl font-extrabold text-blue-800 mb-2">Welcome to the Teacher Dashboard</h2>
      <TeacherStatsCards />
        <TeacherCalendar />
    </div>
    </>
  );
};

export default TeacherDashboard;
