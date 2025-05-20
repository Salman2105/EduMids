
import React from "react";
import SearchBar from "../../components/SearchBar";
import Footer from "../Footer";


const TeacherCourses = () => {
  return (
   <> <div className="p-6">
<SearchBar />
      <h2 className="text-xl font-bold">My Courses</h2>
      <p>This page lists all courses created by the teacher.</p>
    </div>
    <Footer />
    </>
  );
};

export default TeacherCourses;
