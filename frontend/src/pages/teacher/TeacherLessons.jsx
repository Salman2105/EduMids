
import React from "react";
import SearchBar from "../../components/SearchBar";

const TeacherLessons = () => {
  return (
  <> <div className="p-6 h-full">
      <SearchBar />
      <h2 className="text-xl font-bold">Manage Lessons</h2>
      <p>This page lets the teacher manage lessons for their courses.</p>
    </div>
    </> 
  );
};

export default TeacherLessons;
