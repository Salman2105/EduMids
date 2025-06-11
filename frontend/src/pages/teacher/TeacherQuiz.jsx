import React from 'react'
import SearchBar from '../../components/SearchBar'
import QuizCard from './QuizCard'

export default function TeacherQuiz() {
  return (
    <div className="p-6 bg-gradient-to-br from-blue-50 to-white">
      <SearchBar />
      <QuizCard />
    </div>
  )
}
