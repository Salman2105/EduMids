
import React from "react";
// import TeacherDashboardSidebar from "../../components/TeacherDashboardSidebar";
import SearchBar from "../../components/SearchBar";
import Footer from "../Footer";

const TeacherDashboard = () => {
  return (
  <>  <div className="p-6">
      {/* <TeacherDashboardSidebar /> */}
      <SearchBar />
      <h2 className="text-2xl font-bold">Welcome to the Teacher Dashboard</h2>
      <p>This area is for managing courses, lessons, and students.</p>
    </div>
      <Footer />
    </>
  );
};

export default TeacherDashboard;
