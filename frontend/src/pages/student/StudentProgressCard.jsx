import React, { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";

const StudentProgressCard = () => {
  const [progresses, setProgresses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedCourseId, setSelectedCourseId] = useState("");
  const [marking, setMarking] = useState(false);
  const [downloadingLessonId, setDownloadingLessonId] = useState(null);
  const [categories, setCategories] = useState([]);

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

  // Fetch all categories on mount
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await axios.get("http://localhost:5000/api/category");
        setCategories(res.data);
      } catch (err) {
        // Optionally handle error
        setCategories([]);
      }
    };
    fetchCategories();
  }, []);

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
      toast.success("Lesson marked as completed!");
      // Refresh progress after marking
    } catch (err) {
      alert(err.response?.data?.message || "Failed to mark lesson as completed");
    } finally {
      setMarking(false);
    }
  };

  // Download handler for protected lessons
  const handleDownloadLesson = async (lessonId, displayName, resourceType) => {
    setDownloadingLessonId(lessonId);
    try {
      const token = localStorage.getItem("token");
      // Always use backend route for download
      const response = await fetch(`http://localhost:5000/api/progress/download-lesson/${lessonId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const contentType = response.headers.get("content-type");
      if (contentType && contentType.includes("application/json")) {
        const data = await response.json();
        if (!response.ok) {
          alert(data.message || "Download failed");
          return;
        }
        if (data.url) {
          // For PDFs, open in new tab; for videos, trigger download
          if (resourceType === "PDF") {
            window.open(data.url, "_blank", "noopener,noreferrer");
          } else {
            const link = document.createElement("a");
            link.href = data.url;
            link.setAttribute("download", "");
            link.rel = "noopener noreferrer";
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
          }
          return;
        }
        alert("Download failed");
        return;
      }
      if (!response.ok) {
        alert("Download failed");
        return;
      }
      // Download as blob (fallback)
      const blob = await response.blob();
      let filename = displayName;
      const disposition = response.headers.get("Content-Disposition");
      if (disposition && disposition.indexOf("filename=") !== -1) {
        filename = disposition.split("filename=")[1].replace(/['"]/g, "");
      } else if (resourceType === "PDF") {
        filename += ".pdf";
      } else if (resourceType === "VIDEO") {
        filename += ".mp4";
      }
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      a.remove();
      window.URL.revokeObjectURL(url);
    } catch (err) {
      alert("Download failed");
    } finally {
      setDownloadingLessonId(null);
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

  // Debug log to inspect course object
  console.log("Selected course object:", course);

  const completedLessons = Array.isArray(selectedProgress?.completedLessons)
    ? selectedProgress.completedLessons.map(l => (l && l._id ? l._id : l))
    : [];
  const lessons = course?.lessons || [];

  // Helper to check if a file is an image (for mis-uploaded PDFs)
  const isImageFile = (url) => {
    if (!url) return false;
    // Check by extension (jpg, jpeg, png, gif, webp, etc)
    return /\.(jpg|jpeg|png|gif|webp|bmp|svg)$/i.test(url);
  };

  // Helper to get category name by id
  const getCategoryName = (categoryId) => {
    if (!categoryId) return "-";
    // Convert both to string for comparison
    const catIdStr = typeof categoryId === "object" && categoryId !== null && categoryId._id
      ? categoryId._id
      : categoryId.toString();
    const found = categories.find(
      (cat) => cat._id === catIdStr || cat._id === categoryId || cat.name === categoryId
    );
    return found ? found.name : "-";
  };

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
          src="/assets/progress.jpg"
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
              Teacher: {course?.createdBy && typeof course.createdBy === "object"
                ? `${course.createdBy.firstName ?? ""} ${course.createdBy.lastName ?? ""}`.trim()
                : "-"}
            </div>
            <div className="mb-1 text-gray-600">
              Category: {selectedProgress.categoryName
                ? selectedProgress.categoryName
                : getCategoryName(course?.category)}
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
              <>
                <div className="text-green-600 font-semibold mt-2">
                  🏁 Congratulations! You've completed this course.
                </div>
                <div className="mt-4">
                  <a
                    href={`http://localhost:5000/api/certificates/${selectedCourseId}`}
                    className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    🎓 Download Certificate
                  </a>
                </div>
              </>
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
                  const isDownloadable = resourceType === "PDF" || resourceType === "VIDEO";

                  return (
                    <li key={lessonId} className="bg-gray-50 rounded-lg shadow p-4 flex flex-col gap-2 border hover:shadow-lg transition-all w-full">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="font-semibold text-base text-gray-800 truncate max-w-xs" title={displayName}>{displayName}</span>
                        <span className={`text-xs px-2 py-0.5 rounded ${resourceType === "VIDEO" ? "bg-blue-100 text-blue-700" : resourceType === "PDF" ? "bg-red-100 text-red-700" : resourceType === "LINK" ? "bg-green-100 text-green-700" : "bg-gray-200 text-gray-600"}`}>{resourceType}</span>
                        {resourceType === "VIDEO" && resourceUrl && (
                          <video
                            src={resourceUrl}
                            controls
                            className="w-full max-w-xs h-32 rounded mt-2 border"
                            preload="metadata"
                          />
                        )}
                        {resourceType === "PDF" && resourceUrl && (
                          // Always render PDFs as links, never as images
                          <button
                            onClick={() => handleDownloadLesson(lessonId, displayName, resourceType)}
                            className="underline text-blue-600 text-xs ml-1 font-semibold"
                            disabled={downloadingLessonId === lessonId}
                            style={{ cursor: "pointer", background: "none", border: "none", padding: 0 }}
                          >
                            {downloadingLessonId === lessonId ? "Loading..." : "View PDF"}
                          </button>
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
                        {/* Optionally, if you want to show images for image files (not PDFs): */}
                        {resourceType !== "PDF" && resourceUrl && isImageFile(resourceUrl) && (
                          <img
                            src={resourceUrl}
                            alt={displayName}
                            className="w-40 h-24 rounded mt-1 object-contain border"
                          />
                        )}
                        {isDownloadable && resourceUrl && (
                          <button
                            onClick={() => handleDownloadLesson(lessonId, displayName, resourceType, resourceUrl)}
                            className="ml-2 px-2 py-1 bg-gray-200 text-gray-700 rounded text-xs hover:bg-gray-300 transition"
                            title={`Download ${resourceType}`}
                            disabled={downloadingLessonId === lessonId}
                          >
                            {downloadingLessonId === lessonId ? "Downloading..." : "Download"}
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


