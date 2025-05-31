
import React from "react";
import SearchBar from "../../components/SearchBar";
import AdminReportCard from "./AdminReportCard"


const AdminReports = () => {
  return (
  <>  

  <div className="p-6 h-full">
            <SearchBar />
     <AdminReportCard/>
    </div>
    </>
  );
};

export default AdminReports;
