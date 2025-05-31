
import React from "react";
import SearchBar from "../../components/SearchBar";
import LessonCard from "./LessonCard";

const TeacherLessons = () => {
  return (
  <> <div className="p-6">
      <SearchBar />
      {/* <h2 className="text-xl font-bold">Manage Lessons</h2>
      <p>This page lets the teacher manage lessons for their courses.</p> */}
      <LessonCard />
    </div>
    </> 
  );
};

export default TeacherLessons;
