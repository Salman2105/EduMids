import React, { useEffect, useState } from "react";

const StudentCourseCard = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await fetch("http://localhost:5000/api/student/courses", {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!res.ok) throw new Error("Failed to fetch dashboard data");
        const result = await res.json();
        setData(result);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) return <div className="p-4">Loading...</div>;
  if (error) return <div className="p-4 text-red-500">{error}</div>;
  if (!data || !data.courses || data.courses.length === 0)
    return <div className="p-4">You have not enrolled in any courses yet.</div>;

  return (
    <div className="max-w-4xl mx-auto p-4">
      {/* User Info */}
      <div className="mb-6 p-4 bg-white rounded shadow flex items-center gap-4">
        <div className="w-12 h-12 rounded-full bg-blue-200 flex items-center justify-center text-2xl font-bold">
          {data.user.id.slice(0, 2).toUpperCase()}
        </div>
        <div>
          <div className="font-semibold">User ID: {data.user.id}</div>
          <div className="text-sm text-gray-500">Role: {data.user.role}</div>
        </div>
      </div>
      {/* Courses */}
      <div className="space-y-8">
        {data.courses.map((course) => (
          <div key={course.courseId} className="bg-white rounded shadow p-6">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-4">
              <div>
                <h2 className="text-xl font-bold mb-1">{course.title}</h2>
                <p className="text-gray-600 mb-2">{course.description}</p>
                <div className="text-sm text-gray-500">Enrolled: {new Date(course.enrolledAt).toLocaleDateString()}</div>
              </div>
              <div className="mt-4 md:mt-0">
                <div className="font-semibold">Progress: {course.progress}%</div>
                <div className="w-40 h-2 bg-gray-200 rounded mt-1">
                  <div
                    className="h-2 bg-blue-500 rounded"
                    style={{ width: `${course.progress}%` }}
                  ></div>
                </div>
              </div>
            </div>
            {/* Lessons */}
            <div className="mb-4">
              <div className="font-semibold mb-2">Lessons</div>
              {course.lessons.length === 0 ? (
                <div className="text-gray-400 text-sm">No lessons available.</div>
              ) : (
                <ul className="space-y-1">
                  {course.lessons.map((lesson) => (
                    <li key={lesson.lessonId} className="flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-gray-400"></span>
                      <span>{lesson.title}</span>
                      {/* Add lesson status/progress here if available */}
                    </li>
                  ))}
                </ul>
              )}
            </div>
            {/* Quizzes */}
            <div>
              <div className="font-semibold mb-2">Quizzes</div>
              {course.quizzes.length === 0 ? (
                <div className="text-gray-400 text-sm">No quizzes available.</div>
              ) : (
                <ul className="space-y-1">
                  {course.quizzes.map((quiz) => (
                    <li key={quiz.quizId} className="flex items-center gap-2">
                      <span className={`w-2 h-2 rounded-full ${quiz.completed ? "bg-green-500" : "bg-gray-400"}`}></span>
                      <span>{quiz.title}</span>
                      {quiz.completed && quiz.score !== null && (
                        <span className="ml-2 text-xs text-blue-600">Score: {quiz.score}</span>
                      )}
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default StudentCourseCard;
