
import React from "react";
import SearchBar from "../../components/SearchBar";
import StudentCertificateCard from "./StudentCertificateCard";


const StudentCertificates = () => {
  return (
   <> <div className="p-6 bg-gradient-to-br from-blue-50 to-white  ">
    <SearchBar />
    <StudentCertificateCard />
    </div>
    </>
  );
};

export default StudentCertificates;
