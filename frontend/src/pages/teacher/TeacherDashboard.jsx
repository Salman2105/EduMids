
import React from "react";
import SearchBar from "../../components/SearchBar";
import TeacherStatsCards from "./TeacherStatsCards";
import EventsCalendar from "../../components/EventsCalendar";

const TeacherDashboard = () => {
  return (
  <>  <div className="p-6 ">
      <SearchBar />
      <h2 className="text-2xl font-bold">Welcome to the Teacher Dashboard</h2>
      <TeacherStatsCards />
      <div className="mt-8">
        <h3 className="text-xl font-semibold mb-4">Upcoming Events</h3>
        <EventsCalendar />
    </div>
    </div>
    </>
  );
};

export default TeacherDashboard;
