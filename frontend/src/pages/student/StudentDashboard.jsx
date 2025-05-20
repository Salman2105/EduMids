
import React from "react";
import StudentDashboardSidebar from "../../components/StudentDashboardSidebar";
import SearchBar from "../../components/SearchBar";
import Footer from "../Footer";

const StudentDashboard = () => {
  return (
  <>  <div className="p-6">
      {/* <StudentDashboardSidebar /> */}
      <SearchBar />
      <h2 className="text-2xl font-bold">Welcome to the Student Dashboard</h2>
      <p>This area is for enrolled courses, progress, quizzes, and certificates.</p>
    
    </div>
      <Footer />
    </>
  );
};

export default StudentDashboard;
