
import React from "react";
import SearchBar from "../../components/SearchBar";
import Footer from "../Footer";

const TeacherLessons = () => {
  return (
  <> <div className="p-6">
      <SearchBar />
      <h2 className="text-xl font-bold">Manage Lessons</h2>
      <p>This page lets the teacher manage lessons for their courses.</p>
    </div>
    <Footer />
    </> 
  );
};

export default TeacherLessons;
