
import React from "react";
import SearchBar from "../../components/SearchBar";


const StudentCertificates = () => {
  return (
   <> <div className="p-6 h-full">
     <SearchBar />
      <h2 className="text-xl font-bold">My Certificates</h2>
      <p>This page lists all the certificates issued.</p>
    </div>
    </>
  );
};

export default StudentCertificates;
