
import React from "react";
import SearchBar from "../../components/SearchBar";
import StudentCourseCard from "./StudentCourseCard"

const StudentCourses = () => {
  return (
 <> <div className="p-6  ">
       <SearchBar />
      <StudentCourseCard />
    </div>
    </>  
  );
};

export default StudentCourses;
