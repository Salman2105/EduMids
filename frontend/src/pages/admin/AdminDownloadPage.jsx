import React, { useEffect, useState } from "react";
import axios from "axios";

const DownloadPage = () => {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [isAdmin, setIsAdmin] = useState(false);

  // Fetch user role from backend
  useEffect(() => {
    const fetchUserRole = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await axios.get("http://localhost:5000/api/user/me", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setIsAdmin(res.data?.role === "admin");
      } catch (err) {
        setIsAdmin(false);
      }
    };
    fetchUserRole();
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
      {/* Always show Download History */}
      <div className="bg-white rounded-xl shadow-lg p-4 md:p-8">
        <h2 className="text-xl md:text-2xl font-bold text-blue-700 mb-4">
          Download History
          <span className="text-sm text-gray-400 font-normal">
            (All Downloads)
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
                    Course
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
                      colSpan={7}
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
                      <td className="p-3">
                        {/* Display course title if available */}
                        {h.lesson?.course?.title ||
                         h.courseTitle ||
                         h.course?.title ||
                         h.lesson?.courseTitle ||
                         "-"}
                      </td>
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
