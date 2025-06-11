import React from 'react'
import SearchBar from '../../components/SearchBar'
import StudentCard from './StudentCard'
export default function TeacherStudent() {
  return (
    <div className="p-6 bg-gradient-to-br from-blue-50 to-white">
      <SearchBar />
      <StudentCard />

    </div>
  )
}
