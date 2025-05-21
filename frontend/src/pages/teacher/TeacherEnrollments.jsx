import React from 'react'
import SearchBar from "../../components/SearchBar";

const TeacherEnrollments = () => {
  return (
    <> <div className="p-6 h-full">
<SearchBar />
      <h2 className="text-xl font-bold">My enrollment</h2>
      <p>This page lists all courses created by the teacher.</p>
    </div>
    </>
  )
}

export default TeacherEnrollments
