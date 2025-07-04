import React, { useEffect, useState } from "react";
import StartCardTemplate from "./StartCardTemplate";
import { Users, User, UserCog, BookOpen, UserCheck, FileText, BarChart2 } from "lucide-react";

const StatsCards = () => {
  const [stats, setStats] = useState(null);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await fetch("http://localhost:5000/api/admin/dashboard/admin-dashboard", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        const data = await res.json();
        setStats(data);
      } catch (err) {
        console.error("Failed to load Dashboard", err);
      }
    };
    fetchStats();
  }, []);

  if (!stats) return <p>Loading...</p>;
  return (
    <div className="max-w-6xl  mx-auto p-4 md:p-8  bg-gradient-to-br from-blue-50 to-white   ">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8 gap-4">
        <div>
              <h2 className="text-3xl md:text-4xl font-extrabold text-blue-800 mb-2">Welcome to the Admin Dashboard</h2>
        </div>
      </div>
      <div className="flex flex-col md:flex-row md:flex-wrap gap-6 mb-0">
        <StartCardTemplate
          title="Users"
          value={stats.totalUsers ?? 0}
          icon={Users}
          color="bg-blue-500"
        />
        <StartCardTemplate
          title="Students"
          value={stats.totalStudents ?? 0}
          icon={User}
          color="bg-emerald-500"
        />
        <StartCardTemplate
          title="Teachers"
          value={stats.totalTeachers ?? 0}
          icon={UserCog}
          color="bg-rose-500"
        />
        <StartCardTemplate
          title="Courses"
          value={stats.totalCourses ?? 0}
          icon={BookOpen}
          color="bg-indigo-500"
        />
        <StartCardTemplate
          title="Enrollments"
          value={stats.totalEnrollments ?? 0}
          icon={UserCheck}
          color="bg-yellow-500"
        />
        <StartCardTemplate
          title="Quizzes"
          value={stats.totalQuizzes ?? 0}
          icon={FileText}
          color="bg-purple-500"
        />
        <StartCardTemplate
          title="Average Quiz Score"
          value={stats.averageScore !== undefined ? stats.averageScore.toFixed(2) : "0.00"}
          icon={BarChart2}
          color="bg-pink-500"
        />
      </div>
    </div>
  );
};

export default StatsCards;


