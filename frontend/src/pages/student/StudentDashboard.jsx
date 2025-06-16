import React from "react";
import SearchBar from "../../components/SearchBar";
import StudentStatsCards from "./StudentStatsCards";
import StudentCalendar from "./StudentCalendar";
const StudentDashboard = () => {
  return (
  <>  <div className="p-6 bg-gradient-to-br from-blue-50 to-white ">
      <SearchBar />
      <h2 className=" mt-12 mb-6  text-3xl md:text-4xl font-extrabold text-blue-800 mb-2">Welcome to the Student Dashboard</h2>   
      <StudentStatsCards />
      <div className="mt-8">
        {/* <h3 className="text-xl font-semibold mb-4">Upcoming Events</h3> */}
        <StudentCalendar />
    </div>
        </div>

    
    </>
  );
};

export default StudentDashboard;
