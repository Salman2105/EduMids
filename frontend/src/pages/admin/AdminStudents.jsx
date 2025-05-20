
import React from "react";
import SearchBar from "../../components/SearchBar";
import Footer from "../Footer";

const AdminStudents = () => {
  return (
  <> <div className="p-6">
                  <SearchBar />
      <h2 className="text-xl font-bold">Manage Students</h2>
      <p>This page allows the admin to view and manage all students.</p>
    </div>
     <Footer />
    </> 
  );
};

export default AdminStudents;
