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
        const token = localStorage.getItem("token"); // always get fresh token
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
      const token = localStorage.getItem("token"); // always get fresh token
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

  // Download handler for protected lessons
  const handleDownloadLesson = async (lessonId, displayName, resourceType) => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`http://localhost:5000/api/progress/download-lesson/${lessonId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!response.ok) {
        const data = await response.json();
        alert(data.message || "Download failed");
        return;
      }
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = displayName + (resourceType === "PDF" ? ".pdf" : resourceType === "VIDEO" ? ".mp4" : "");
      document.body.appendChild(a);
      a.click();
      a.remove();
      window.URL.revokeObjectURL(url);
    } catch (err) {
      alert("Download failed");
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
    <div className="max-w-4xl mx-auto p-4 md:p-8 min-h-screen bg-gradient-to-br from-blue-50 to-white">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8 gap-4">
        <div>
          <h2 className="text-3xl md:text-4xl font-extrabold text-blue-800 mb-2">Course Progress</h2>
          <p className="text-gray-600 text-base md:text-lg">
            Track your lesson completion and download resources for each course.
          </p>
        </div>
        <img
          src="/assets/progress.png"
          alt="Progress"
          className="w-24 h-24 md:w-32 md:h-32 object-contain hidden md:block"
        />
      </div>
      <div className="space-y-6">
        {/* Course selection dropdown */}
        <div className="mb-4">
          <label className="font-semibold mr-2">Select Course:</label>
          <select
            value={selectedCourseId}
            onChange={e => setSelectedCourseId(e.target.value)}
            className="border border-blue-200 rounded px-2 py-1 focus:ring-2 focus:ring-blue-400"
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
          <div className="border rounded-xl p-4 shadow-lg bg-white">
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
              <summary className="cursor-pointer text-blue-600 font-semibold text-lg select-none">Lessons</summary>
              <ul className="list-none ml-0 mt-3 flex flex-col gap-4 w-full">
                {lessons.length === 0 && <li className="text-gray-500">No lessons in this course.</li>}
                {lessons.map((lesson) => {
                  const lessonId = lesson._id ? lesson._id : lesson;
                  const isCompleted = completedLessons.includes(lessonId.toString());
                  let resourceType = lesson.contentType ? lesson.contentType.toUpperCase() : "UNKNOWN";
                  let resourceUrl = lesson.contentURL || null;
                  let displayName = lesson.title || lesson.name || lessonId;
                  // Download link logic
                  const isDownloadable = resourceType === "PDF" || resourceType === "VIDEO";
                  const downloadUrl = resourceUrl && !resourceUrl.startsWith("http") ? `http://localhost:5000/${resourceUrl}` : resourceUrl;
                  return (
                    <li key={lessonId} className="bg-gray-50 rounded-lg shadow p-4 flex flex-col gap-2 border hover:shadow-lg transition-all w-full">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="font-semibold text-base text-gray-800 truncate max-w-xs" title={displayName}>{displayName}</span>
                        <span className={`text-xs px-2 py-0.5 rounded ${resourceType === "VIDEO" ? "bg-blue-100 text-blue-700" : resourceType === "PDF" ? "bg-red-100 text-red-700" : resourceType === "LINK" ? "bg-green-100 text-green-700" : "bg-gray-200 text-gray-600"}`}>{resourceType}</span>
                        {resourceType === "VIDEO" && resourceUrl && (
                          <video
                            src={downloadUrl}
                            controls
                            className="w-full max-w-xs h-32 rounded mt-2 border"
                            preload="metadata"
                          />
                        )}
                        {resourceType === "PDF" && resourceUrl && (
                          <a
                            href={downloadUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="underline text-blue-600 text-xs ml-1 font-semibold"
                          >
                            View PDF
                          </a>
                        )}
                        {resourceType === "LINK" && resourceUrl && (
                          <a
                            href={resourceUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="underline text-green-600 text-xs ml-1 font-semibold"
                          >
                            Open Link
                          </a>
                        )}
                        {isDownloadable && resourceUrl && (
                          <button
                            onClick={() => handleDownloadLesson(lessonId, displayName, resourceType)}
                            className="ml-2 px-2 py-1 bg-gray-200 text-gray-700 rounded text-xs hover:bg-gray-300 transition"
                            title={`Download ${resourceType}`}
                          >
                            Download
                          </button>
                        )}
                      </div>
                      <div className="flex items-center gap-2 mt-2">
                        {isCompleted ? (
                          <span className="text-green-600 font-semibold flex items-center gap-1">✓ Completed</span>
                        ) : (
                          <button
                            className="px-3 py-1 bg-blue-500 text-white rounded text-xs hover:bg-blue-600 transition"
                            disabled={marking}
                            onClick={() => handleCompleteLesson(course._id, lessonId)}
                          >
                            Mark as Completed
                          </button>
                        )}
                      </div>
                    </li>
                  );
                })}
              </ul>
            </details>
          </div>
        )}
      </div>
    </div>
  );
};

export default StudentProgressCard;
