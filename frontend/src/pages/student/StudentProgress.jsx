import React from 'react'
import SearchBar from "../../components/SearchBar";
import StudentProgressCard from "./StudentProgressCard";


const StudentProgress = () => {
  return (
 <> <div className="p-6">
      <SearchBar />
      <StudentProgressCard />
    </div>
    </> 
  )
}

export default StudentProgress
