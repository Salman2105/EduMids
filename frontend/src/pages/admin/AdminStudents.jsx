
import React from "react";
import SearchBar from "../../components/SearchBar";

const AdminStudents = () => {
  return (
  <> <div className="p-6 h-full">
                  <SearchBar />
      <h2 className="text-xl font-bold">Manage Students</h2>
      <p>This page allows the admin to view and manage all students.</p>
    </div>
    </> 
  );
};

export default AdminStudents;
