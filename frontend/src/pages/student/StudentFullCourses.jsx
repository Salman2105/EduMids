import React from 'react'
import SearchBar from '../../components/SearchBar'
import StudentAllCoursesCard from "./StudentAllCoursesCard"

export default function StudentFullCourses() {
  return (
    <div className='p-6'>
      <SearchBar />
      <StudentAllCoursesCard />
    </div>
  )
}
