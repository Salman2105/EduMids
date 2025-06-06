import React, { useEffect, useState } from "react";

const StudentCourseCard = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [unenrolling, setUnenrolling] = useState({});
  const [allQuizzes, setAllQuizzes] = useState([]);

  const fetchData = async () => {
    try {
      const user = localStorage.getItem("user");
      console.log("User from localStorage:", user);
      const token = localStorage.getItem("token"); // always get fresh token
      console.log("token from localStorage:", token);
      const res = await fetch("http://localhost:5000/api/enrollments/enroll-courses", {
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

  useEffect(() => {
    fetchData();
    // Fetch all quizzes for all courses using /quizzes/student/all
    const fetchAllQuizzes = async () => {
      try {
        const token = localStorage.getItem("token"); // always get fresh token
        const res = await fetch("http://localhost:5000/api/quizzes/student/all", {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!res.ok) throw new Error("Failed to fetch all quizzes");
        const data = await res.json();
        setAllQuizzes(data.quizzes || []);
      } catch (err) {
        // Optionally handle error
      }
    };
    fetchAllQuizzes();
  }, []);

  const handleUnenroll = async (courseId) => {
    setUnenrolling((prev) => ({ ...prev, [courseId]: true }));
    try {
      const token = localStorage.getItem("token"); // always get fresh token
      const res = await fetch(`http://localhost:5000/api/enrollments/${courseId}`,
        {
          method: "DELETE",
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      if (!res.ok) throw new Error("Failed to unenroll from course");
      await fetchData();
    } catch (err) {
      alert(err.message);
    } finally {
      setUnenrolling((prev) => ({ ...prev, [courseId]: false }));
    }
  };

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
                <div className="text-sm text-gray-500">
                  Enrolled: {new Date(course.enrolledAt).toLocaleDateString()}
                </div>
              </div>
              <div className="mt-4 md:mt-0">
                <div className="font-semibold">
                  Progress: {typeof course.progress === "number" ? course.progress : 0}%
                </div>
                <div className="w-40 h-2 bg-gray-200 rounded mt-1">
                  <div
                    className="h-2 bg-blue-500 rounded"
                    style={{ width: `${typeof course.progress === "number" ? course.progress : 0}%` }}
                  ></div>
                </div>
              </div>
            </div>
            {/* Lessons */}
            <div className="mb-4">
              <div className="font-semibold mb-2">Lessons</div>
              {(course.lessons && course.lessons.length > 0) ? (
                <ul className="space-y-1">
                  {course.lessons.map((lesson) => {
                    // Check if lesson is completed (assuming course.completedLessons is an array of lesson IDs)
                    const isCompleted = Array.isArray(course.completedLessons) && (course.completedLessons.includes(lesson.lessonId) || course.completedLessons.includes(lesson._id));
                    return (
                      <li key={lesson.lessonId || lesson._id} className="flex items-center gap-2">
                        <span className={`w-2 h-2 rounded-full ${isCompleted ? "bg-green-500" : "bg-gray-400"}`}></span>
                        <span className={isCompleted ? "text-green-700 font-semibold" : undefined}>{lesson.title}</span>
                        {isCompleted && (
                          <span className="ml-2 text-xs text-green-600">Completed</span>
                        )}
                      </li>
                    );
                  })}
                </ul>
              ) : (
                <div className="text-gray-400 text-sm">No lessons available.</div>
              )}
            </div>
            {/* Quizzes */}
            <div>
              <div className="font-semibold mb-2">
                {/* Count quizzes for this course from allQuizzes */}
                Quizzes ({allQuizzes.filter(q => String(q.courseId) === String(course.courseId)).length})
              </div>
              {(() => {
                // Find all quizzes for this course from allQuizzes
                const quizzesForCourse = allQuizzes.filter(q => String(q.courseId) === String(course.courseId));
                if (quizzesForCourse.length > 0) {
                  return (
                    <ul className="space-y-1">
                      {quizzesForCourse.map((quiz) => (
                        <li key={quiz.quizId} className="flex items-center gap-2">
                          <span className={`w-2 h-2 rounded-full ${quiz.completed ? "bg-green-500" : "bg-gray-400"}`}></span>
                          <span>{quiz.title}</span>
                          {quiz.completed ? (
                            <span className="ml-2 text-xs text-green-600">Submitted{quiz.score !== null ? ` (Score: ${quiz.score})` : ""}</span>
                          ) : (
                            <span className="ml-2 text-xs text-gray-500">Not Submitted</span>
                          )}
                        </li>
                      ))}
                    </ul>
                  );
                } else {
                  return <div className="text-gray-400 text-sm">No quizzes available.</div>;
                }
              })()}
            </div>
            <button
              className="mt-4 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
              onClick={() => handleUnenroll(course.courseId)}
              disabled={unenrolling[course.courseId]}
            >
              {unenrolling[course.courseId] ? "Unenrolling..." : "Unenroll"}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default StudentCourseCard;
