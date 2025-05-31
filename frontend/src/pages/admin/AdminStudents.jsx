
import React from "react";
import SearchBar from "../../components/SearchBar";
import AdminStudentsCard from "./AdminStudentsCard";

const AdminStudents = () => {
  return (
  <> <div className="p-6">
                  <SearchBar />
  <AdminStudentsCard />
    </div>
    </> 
  );
};

export default AdminStudents;
