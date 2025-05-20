import React, { useEffect, useState } from "react";
import { Card } from "./ui/card";
import { Users, UserCog, BookOpen, UserCheck, FileText } from "lucide-react";

// StatCard Component
const StatCard = ({ title, value, icon, iconBg }) => (
  <Card className="p-4 flex items-center gap-4">
    <div className={`w-12 h-12 rounded-md flex items-center justify-center ${iconBg}`}>
      {icon}
    </div>
    <div className="flex-1">
      <div className="text-sm text-gray-500">{title}</div>
      <div className="text-2xl font-bold">{value}</div>
    </div>
  </Card>
);

// StatsCards Component
const StatsCards = () => {
  const [stats, setStats] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await fetch("http://localhost:5000/api/admin/dashboard/admin-dashboard", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        if (!res.ok) throw new Error("Failed to fetch stats");
        const data = await res.json();
        setStats(data);
      } catch (err) {
        setError("Failed to load analytics");
        console.error("Failed to load analytics", err);
      }
    };
    fetchStats();
  }, []);

  if (error) return <p>{error}</p>;
  if (!stats) return <p>Loading...</p>;
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
      <StatCard
        title="Students"
        value={stats.totalStudents ?? 0}
        icon={<Users size={20} className="text-white" />}
        iconBg="bg-blue-500"
      />
      <StatCard
        title="Teachers"
        value={stats.totalTeachers ?? 0}
        icon={<UserCog size={20} className="text-white" />}
        iconBg="bg-rose-500"
      />
      <StatCard
        title="Courses"
        value={stats.totalCourses ?? 0}
        icon={<BookOpen size={20} className="text-white" />}
        iconBg="bg-indigo-500"
      />
      <StatCard
        title="Enrollments"
        value={stats.totalEnrollments ?? 0}
        icon={<UserCheck size={20} className="text-white" />}
        iconBg="bg-emerald-500"
      />
      <StatCard
        title="Quizzes"
        value={stats.totalQuizzes ?? 0}
        icon={<FileText size={20} className="text-white" />}
        iconBg="bg-yellow-500"
      />
      <StatCard
        title="Average Quiz Score"
        value={stats.averageScore !== undefined ? stats.averageScore.toFixed(2) : "0.00"}
        icon={<FileText size={20} className="text-white" />}
        iconBg="bg-purple-500"
      />
    </div>
  );
};

export default StatsCards;

