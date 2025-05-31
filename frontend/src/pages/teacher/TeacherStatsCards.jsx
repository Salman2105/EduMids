import React, { useEffect, useState } from "react";
import StartCardTemplate from "./StartCardTemplate";
import { BookOpen, UserCheck, FileText, BarChart2, Users } from "lucide-react";

const TeacherStatsCards = () => {
  const [stats, setStats] = useState(null);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await fetch("http://localhost:5000/api/teacher/dashboard/teacher-dashboard", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        const data = await res.json();
        if (res.ok) {
          setStats(data);
        } else {
          setStats(null);
          console.error("Failed to load Teacher Dashboard:", data.message || "Unknown error");
        }
      } catch (err) {
        setStats(null);
        console.error("Failed to load Teacher Dashboard", err);
      }
    };
    fetchStats();
  }, []);

  if (!stats) return <p>Loading...</p>;
  return (
    <div className="flex flex-col md:flex-row md:flex-wrap gap-6 mb-6">
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
        color="bg-emerald-500"
      />
      <StartCardTemplate
        title="Quizzes"
        value={stats.totalQuizzes ?? 0}
        icon={FileText}
        color="bg-yellow-500"
      />
      <StartCardTemplate
        title="Average Quiz Score"
        value={stats.averageScore !== undefined ? stats.averageScore.toFixed(2) : "0.00"}
        icon={BarChart2}
        color="bg-purple-500"
      />
      <StartCardTemplate
        title="Students"
        value={stats.totalStudents ?? 0}
        icon={Users}
        color="bg-blue-500"
      />
    </div>
  );
};

export default TeacherStatsCards;
