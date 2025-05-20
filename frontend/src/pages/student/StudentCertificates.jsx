
import React from "react";
import SearchBar from "../../components/SearchBar";
import Footer from "../Footer";


const StudentCertificates = () => {
  return (
   <> <div className="p-6">
                  <SearchBar />
      <h2 className="text-xl font-bold">My Certificates</h2>
      <p>This page lists all the certificates you've earned.</p>
    </div>
    <Footer />
    </>
  );
};

export default StudentCertificates;
