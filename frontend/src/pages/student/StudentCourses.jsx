
import React from "react";
import SearchBar from "../../components/SearchBar";
import Footer from "../Footer";

const StudentCourses = () => {
  return (
 <> <div className="p-6">
                        <SearchBar />
      <h2 className="text-xl font-bold">My Enrolled Courses</h2>
      <p>This page shows all the courses you are enrolled in.</p>
    </div>
    <Footer />
    </>  
  );
};

export default StudentCourses;
