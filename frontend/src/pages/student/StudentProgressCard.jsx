import React, { useEffect, useState } from "react";
import axios from "axios";

const StudentProgressCard = () => {
  const [progresses, setProgresses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedCourseId, setSelectedCourseId] = useState("");
  const [marking, setMarking] = useState(false);

  // Replace with your auth token logic
  const token = localStorage.getItem("token");
  console.log("Token:", token);
  const user = localStorage.getItem("user");
  console.log("User:", user);

  // Fetch all enrolled courses with progress
  useEffect(() => {
    const fetchProgress = async () => {
      setLoading(true);
      try {
        const res = await axios.get(
          "http://localhost:5000/api/progress/my-enrolled-progress",
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        const data = Array.isArray(res.data) ? res.data : res.data ? [res.data] : [];
        setProgresses(data);
        // Set default selected course
        if (data.length && !selectedCourseId) setSelectedCourseId(data[0].courseId._id);
      } catch (err) {
        setError(err.response?.data?.message || "Failed to fetch progress");
      } finally {
        setLoading(false);
      }
    };
    fetchProgress();
    // eslint-disable-next-line
  }, [token, marking]);

  // Handler to mark lesson as completed
  const handleCompleteLesson = async (courseId, lessonId) => {
    setMarking(true);
    try {
      await axios.post(
        "http://localhost:5000/api/progress/complete-lesson",
        { courseId, lessonId },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      // Refresh progress after marking
    } catch (err) {
      alert(err.response?.data?.message || "Failed to mark lesson as completed");
    } finally {
      setMarking(false);
    }
  };

  if (loading) return <div>Loading progress...</div>;
  if (error) return <div className="text-red-500">{error}</div>;
  if (!progresses.length) return <div>No progress found.</div>;

  // Find selected course progress
  const selectedProgress = progresses.find(
    (p) => p.courseId && p.courseId._id === selectedCourseId
  );
  const course = selectedProgress?.courseId;
  const completedLessons = Array.isArray(selectedProgress?.completedLessons)
    ? selectedProgress.completedLessons.map(l => (l && l._id ? l._id : l))
    : [];
  const lessons = course?.lessons || [];

  return (
    <div className="space-y-6">
      {/* Course selection dropdown */}
      <div className="mb-4">
        <label className="font-semibold mr-2">Select Course:</label>
        <select
          value={selectedCourseId}
          onChange={e => setSelectedCourseId(e.target.value)}
          className="border rounded px-2 py-1"
        >
          {progresses.filter(p => p.courseId && p.courseId._id).map((p) => (
            <option key={p.courseId._id} value={p.courseId._id}>
              {p.courseId.title}
            </option>
          ))}
        </select>
      </div>

      {/* Show selected course progress */}
      {selectedProgress && (
        <div className="border rounded-lg p-4 shadow-md bg-white">
          <h2 className="text-xl font-bold mb-2">
            {course?.title || "Untitled Course"}
          </h2>
          <div className="mb-1 text-gray-600">
            Teacher: {course?.createdBy?.firstName} {course?.createdBy?.lastName}
          </div>
          <div className="mb-1 text-gray-600">
            Category: {course?.category?.name}
          </div>
          <div className="mb-2">
            Progress: <span className="font-semibold">{typeof selectedProgress.progressPercentage === "number" ? selectedProgress.progressPercentage.toFixed(1) : "0.0"}%</span>
            <div className="w-full bg-gray-200 rounded-full h-3 mt-1">
              <div
                className="bg-green-500 h-3 rounded-full"
                style={{ width: `${selectedProgress.progressPercentage || 0}%` }}
              ></div>
            </div>
          </div>
          <div className="mb-2">
            Completed Lessons: {completedLessons.length} / {lessons.length || "?"}
          </div>
          {selectedProgress.progressPercentage === 100 && (
            <div className="text-green-600 font-semibold mt-2">
              🏁 Congratulations! You've completed this course.
            </div>
          )}

          {/* Lessons list with completion action */}
          <details className="mt-2" open>
            <summary className="cursor-pointer text-blue-600">Lessons</summary>
            <ul className="list-disc ml-6 mt-1">
              {lessons.length === 0 && <li>No lessons in this course.</li>}
              {lessons.map((lesson) => {
                const lessonId = lesson._id ? lesson._id : lesson;
                const isCompleted = completedLessons.includes(lessonId.toString());
                return (
                  <li key={lessonId} className="flex items-center gap-2">
                    <span>
                      {lesson.title || lesson.name || lessonId}
                    </span>
                    {isCompleted ? (
                      <span className="text-green-600 ml-2">✓ Completed</span>
                    ) : (
                      <button
                        className="ml-2 px-2 py-1 bg-blue-500 text-white rounded text-xs"
                        disabled={marking}
                        onClick={() => handleCompleteLesson(course._id, lessonId)}
                      >
                        Mark as Completed
                      </button>
                    )}
                  </li>
                );
              })}
            </ul>
          </details>
        </div>
      )}
    </div>
  );
};

export default StudentProgressCard;
