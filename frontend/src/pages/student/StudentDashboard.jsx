import React from "react";
import SearchBar from "../../components/SearchBar";
import StudentStatsCards from "./StudentStatsCards";
import EventsCalendar from "../../components/EventsCalendar";

const StudentDashboard = () => {
  return (
  <>  <div className="p-6  ">
      <SearchBar />
      <h2 className="text-2xl font-bold">Welcome to the Student Dashboard</h2>   
      <StudentStatsCards />
      <div className="mt-8">
        {/* <h3 className="text-xl font-semibold mb-4">Upcoming Events</h3> */}
        <EventsCalendar />
    </div>
        </div>

    
    </>
  );
};

export default StudentDashboard;
