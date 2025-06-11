import React from 'react'
import SearchBar from '../../components/SearchBar'
import NotifyCard from '../../components/NotifyCard'


export default function TeacherNotify() {
  return (
    <div className="p-6 bg-gradient-to-br from-blue-50 to-white">
      <SearchBar />
      <NotifyCard />
    </div>
  )
}
