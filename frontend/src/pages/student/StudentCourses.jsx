
import React from "react";
import SearchBar from "../../components/SearchBar";

const StudentCourses = () => {
  return (
 <> <div className="p-6 h-full ">
                        <SearchBar />
      <h2 className="text-xl font-bold">My Enrolled Courses</h2>
      <p>This page shows all the courses you are enrolled in.</p>
    </div>
    </>  
  );
};

export default StudentCourses;
