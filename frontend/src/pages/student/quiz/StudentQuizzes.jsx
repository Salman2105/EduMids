
import React from "react";
import SearchBar from "../../../components/SearchBar";
import StudentQuizzCard from "./StudentQizzCard"
    

const StudentQuizzes = () => {
  return (
  <> <div className="p-6 ">
      <SearchBar />
    <StudentQuizzCard />
    </div>
    </> 
  );
};

export default StudentQuizzes;
