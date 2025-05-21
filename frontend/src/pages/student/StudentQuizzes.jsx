
import React from "react";
import SearchBar from "../../components/SearchBar";
    

const StudentQuizzes = () => {
  return (
  <> <div className="p-6 h-full">
      <SearchBar />
      <h2 className="text-xl fon  t-bold">My Quizzes</h2>
      <p>This page displays all quizzes available or attempted.</p>
    </div>
    </> 
  );
};

export default StudentQuizzes;
