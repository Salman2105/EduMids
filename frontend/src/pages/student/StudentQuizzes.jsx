
import React from "react";
import SearchBar from "../../components/SearchBar";
import Footer from "../Footer";
    

const StudentQuizzes = () => {
  return (
  <> <div className="p-6">
      <SearchBar />
      <h2 className="text-xl font-bold">My Quizzes</h2>
      <p>This page displays all quizzes available or attempted.</p>
    </div>
    <Footer />
    </> 
  );
};

export default StudentQuizzes;
