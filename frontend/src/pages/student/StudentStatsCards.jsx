
import React, { useEffect, useState } from "react";
import axios from "axios";

const Card = ({ title, value }) => (
  <div className="bg-white shadow rounded p-6 w-full md:w-1/3">
    <h4 className="text-gray-500">{title}</h4>
    <p className="text-2xl font-bold">{value}</p>
  </div>
);

const StudentDashboard = () => {
  const [data, setData] = useState(null);

  useEffect(() => {
    const fetchStudentStats = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await axios.get("http://localhost:5000/api/student/dashboard/student-dashboard", {
          headers: { Authorization: `Bearer ${token}` }
        });
        setData(res.data);
      } catch (err) {
        console.error("Error fetching student stats", err);
      }
    };
    fetchStudentStats();
  }, []);

  if (!data) return <p>Loading...</p>;

  return (
    <div className="p-6">
      {/* <h2 className="text-2xl font-bold mb-6">Student Dashboard</h2> */}
      <div className="flex flex-wrap gap-4">
        <Card title="Courses Enrolled" value={data.coursesEnrolled} />
        <Card title="Courses Completed" value={data.coursesCompleted} />
        <Card title="Certificates Earned" value={data.certificates} />
      </div>
    </div>
  );
};

export default StudentDashboard;
