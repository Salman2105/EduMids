
import React from "react";
import SearchBar from "../../components/SearchBar";
import StudentCertificateCard from "./StudentCertificateCard";


const StudentCertificates = () => {
  return (
   <> <div className="p-6  ">
    <SearchBar />
    <StudentCertificateCard />
    </div>
    </>
  );
};

export default StudentCertificates;
