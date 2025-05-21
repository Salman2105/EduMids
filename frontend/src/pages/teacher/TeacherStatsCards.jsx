import React, { useEffect, useState } from "react";
import axios from "axios";

const Card = ({ title, value }) => (
  <div className="bg-white shadow rounded p-6 w-full md:w-1/3">
    <h4 className="text-gray-500">{title}</h4>
    <p className="text-2xl font-bold">{value}</p>
  </div>
);

const TeacherDashboard = () => {
  const [data, setData] = useState(null);

  useEffect(() => {
    const fetchTeacherStats = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await axios.get("http://localhost:5000/api/teacher/dashboard/teacher-dashboard", {
          headers: { Authorization: `Bearer ${token}` }
        });
        setData(res.data);
      } catch (err) {
        console.error("Error fetching teacher stats", err);
      }
    };
    fetchTeacherStats();
  }, []);

  if (!data) return <p>Loading...</p>;

  return (
    <div className="p-6 h-full">
      {/* <h2 className="text-2xl font-bold mb-6">Teacher Dashboard</h2> */}
      <div className="flex flex-wrap gap-4">
        <Card title="Courses Created" value={data.totalCourses} />
        <Card title="Total Enrollments" value={data.totalEnrollments} />
        <Card title="Quizzes Created" value={data.totalQuizzes} />
        <Card title="Average Quiz Score" value={data.averageScore !== undefined ? data.averageScore.toFixed(2) : "0.00"} />
        <Card title="Total Students" value={data.totalStudents} />
      </div>
    </div>
  );
};

export default TeacherDashboard;
