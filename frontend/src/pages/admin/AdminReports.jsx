
import React from "react";
import SearchBar from "../../components/SearchBar";
import Footer from "../Footer";



const AdminReports = () => {
  return (
  <>  <div className="p-6">
            <SearchBar />
      <h2 className="text-xl font-bold">Admin Reports</h2>
      <p>This page displays system analytics and reports.</p>
    </div>
        <Footer />
    </>
  );
};

export default AdminReports;
