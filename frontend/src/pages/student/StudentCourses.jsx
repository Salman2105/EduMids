
import React from "react";
import SearchBar from "../../components/SearchBar";
import StudentCourseCard from "./StudentCourseCard"

const StudentCourses = () => {
  return (
 <> <div className="p-6 h-full ">
       <SearchBar />
      <StudentCourseCard />
    </div>
    </>  
  );
};

export default StudentCourses;
