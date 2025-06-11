
import React from "react";
import SearchBar from "../../components/SearchBar";
import StudentCourseCard from "./StudentCourseCard"

const StudentCourses = () => {
  return (
 <> <div className="p-6 bg-gradient-to-br from-blue-50 to-white ">
       <SearchBar />
      <StudentCourseCard />
    </div>
    </>  
  );
};

export default StudentCourses;
