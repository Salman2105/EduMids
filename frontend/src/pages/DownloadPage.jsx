import React, { useEffect, useState } from "react";
import axios from "axios";

const DownloadPage = () => {
  const [lessons, setLessons] = useState([]);
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Fetch lessons (downloadable files)
  useEffect(() => {
    const fetchLessons = async () => {
      try {
        // There is no /api/lessons/all endpoint. Instead, fetch all lessons for all courses the user is enrolled in (student) or created (teacher).
        // For simplicity, let's fetch all lessons for all courses (admin/teacher) or all enrolled courses (student).
        const token = localStorage.getItem("token");
        let lessonsArr = [];
        // Try to get all courses for the user (student or teacher)
        let coursesRes = await axios.get("http://localhost:5000/api/student/enrolled-courses", {
          headers: { Authorization: `Bearer ${token}` },
        });
        // coursesRes.data is an array of courses, each with lessons
        if (Array.isArray(coursesRes.data)) {
          coursesRes.data.forEach((course) => {
            if (Array.isArray(course.lessons)) {
              lessonsArr = lessonsArr.concat(course.lessons.map(l => ({ ...l, courseTitle: course.title })));
            }
          });
        }
        setLessons(lessonsArr);
      } catch (err) {
        setError("Failed to fetch lessons");
      }
    };
    fetchLessons();
  }, []);

  // Fetch download history (admin only)
  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const res = await axios.get("http://localhost:5000/api/download/history", {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        });
        setHistory(res.data || []);
      } catch (err) {
        setHistory([]);
      } finally {
        setLoading(false);
      }
    };
    fetchHistory();
  }, []);

  const handleDownload = async (lessonId) => {
    const token = localStorage.getItem("token");
    try {
      const response = await fetch(`http://localhost:5000/api/download/lesson/${lessonId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (!response.ok) {
        throw new Error("Failed to download file");
      }
      const blob = await response.blob();
      // Try to get filename from Content-Disposition header
      const disposition = response.headers.get("Content-Disposition");
      let filename = "download";
      if (disposition && disposition.indexOf("filename=") !== -1) {
        filename = disposition.split("filename=")[1].replace(/['"]/g, "");
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
      alert("Access denied or download failed.");
    }
  };

  return (
    <div className="max-w-6xl mx-auto p-4 md:p-8 min-h-screen bg-gradient-to-br from-blue-50 to-white">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8 gap-4">
        <div>
          <h1 className="text-3xl md:text-4xl font-extrabold text-blue-800 mb-2">
            Download Center
          </h1>
          <p className="text-gray-600 text-base md:text-lg">
            Access your course resources and track your download activity.
          </p>
        </div>
        <img
          src="/assets/download.jpeg"
          alt="Download"
          className="w-24 h-24 md:w-32 md:h-32 object-contain hidden md:block"
        />
      </div>
      {error && (
        <div className="text-red-500 mb-4 font-semibold">{error}</div>
      )}
      <div className="bg-white rounded-xl shadow-lg p-4 md:p-8 mb-10">
        <h2 className="text-xl md:text-2xl font-bold text-blue-700 mb-4">
          Downloadable Lessons
        </h2>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead>
              <tr className="bg-blue-100">
                <th className="p-3 text-left font-semibold text-gray-700">
                  Title
                </th>
                <th className="p-3 text-left font-semibold text-gray-700">
                  Type
                </th>
                <th className="p-3 text-left font-semibold text-gray-700">
                  Course
                </th>
                <th className="p-3 text-left font-semibold text-gray-700">
                  Action
                </th>
              </tr>
            </thead>
            <tbody>
              {lessons
                .filter((l) => ["video", "pdf"].includes(l.contentType))
                .map((lesson) => (
                  <tr
                    key={lesson._id}
                    className="hover:bg-blue-50 transition"
                  >
                    <td className="p-3 font-medium text-gray-900">
                      {lesson.title}
                    </td>
                    <td className="p-3 capitalize text-gray-700">
                      {lesson.contentType}
                    </td>
                    <td className="p-3 text-gray-700">
                      {lesson.courseTitle || "-"}
                    </td>
                    <td className="p-3">
                      <button
                        className="bg-gradient-to-r from-blue-600 to-blue-400 text-white px-4 py-2 rounded-lg shadow hover:from-blue-700 hover:to-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-300 transition"
                        onClick={() => handleDownload(lesson._id)}
                      >
                        <span className="inline-block align-middle mr-2">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-5 w-5 inline"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M4 16v2a2 2 0 002 2h12a2 2 0 002-2v-2M7 10l5 5m0 0l5-5m-5 5V4"
                            />
                          </svg>
                        </span>
                        Download
                      </button>
                    </td>
                  </tr>
                ))}
              {lessons.filter((l) => ["video", "pdf"].includes(l.contentType))
                .length === 0 && (
                <tr>
                  <td
                    colSpan={4}
                    className="p-3 text-center text-gray-500"
                  >
                    No downloadable lessons found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
      <div className="bg-white rounded-xl shadow-lg p-4 md:p-8">
        <h2 className="text-xl md:text-2xl font-bold text-blue-700 mb-4">
          Download History
          <span className="text-sm text-gray-400 font-normal">
            {history.length > 0 && history[0].user && history[0].user.email && history[0].user.email === "admin@example.com"
              ? " (Admin Only)"
              : " (Your History)"}
          </span>
        </h2>
        {loading ? (
          <div className="text-gray-500">Loading history...</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead>
                <tr className="bg-blue-100">
                  <th className="p-3 text-left font-semibold text-gray-700">
                    User
                  </th>
                  <th className="p-3 text-left font-semibold text-gray-700">
                    File Name
                  </th>
                  <th className="p-3 text-left font-semibold text-gray-700">
                    Path
                  </th>
                  <th className="p-3 text-left font-semibold text-gray-700">
                    Date
                  </th>
                  <th className="p-3 text-left font-semibold text-gray-700">
                    IP
                  </th>
                  <th className="p-3 text-left font-semibold text-gray-700">
                    User Agent
                  </th>
                </tr>
              </thead>
              <tbody>
                {history.length === 0 ? (
                  <tr>
                    <td
                      colSpan={6}
                      className="p-3 text-center text-gray-500"
                    >
                      No history found.
                    </td>
                  </tr>
                ) : (
                  history.map((h) => (
                    <tr
                      key={h._id}
                      className="hover:bg-blue-50 transition"
                    >
                      <td className="p-3">
                        {h.user ? (
                          <span className="font-semibold text-blue-700">
                            {h.user.name}
                          </span>
                        ) : (
                          <span className="text-gray-400">Guest</span>
                        )}
                        <br />
                        <span className="text-xs text-gray-500">
                          {h.user?.email}
                        </span>
                      </td>
                      <td className="p-3">{h.fileName}</td>
                      <td className="p-3 text-xs text-gray-600">
                        {h.filePath}
                      </td>
                      <td className="p-3 text-xs">
                        {new Date(h.downloadedAt).toLocaleString()}
                      </td>
                      <td className="p-3 text-xs">{h.ip}</td>
                      <td className="p-3 text-xs truncate max-w-xs" title={h.userAgent}>
                        {h.userAgent}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default DownloadPage;
