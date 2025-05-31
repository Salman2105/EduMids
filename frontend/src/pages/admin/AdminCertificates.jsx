
import React from "react";
import SearchBar from "../../components/SearchBar";
import AdminCertificateCard from "./AdminCertificateCard";


const StudentCertificates = () => {
  return (
   <> <div className="p-6 ">
     <SearchBar />
      <AdminCertificateCard />
    </div>
    </>
  );
};

export default StudentCertificates;
