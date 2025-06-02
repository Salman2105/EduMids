import React from 'react'
import SearchBar from "../../components/SearchBar";
import StudentProgressCard from "./StudentProgressCard";
// import CourseDetails from "../CourseDetails"


const StudentProgress = () => {
  return (
 <> <div className="p-6">
      <SearchBar />
      <StudentProgressCard />
      {/* <CourseDetails /> */}
    </div>
    </> 
  )
}

export default StudentProgress
