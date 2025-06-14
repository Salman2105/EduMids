import React, { useEffect, useState } from "react";
import axios from "axios";

const DownloadPage = () => {
  const [lessons, setLessons] = useState([]);
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Add state for certificates
  const [certificates, setCertificates] = useState([]);
  const [certLoading, setCertLoading] = useState(true);
  const [certError, setCertError] = useState(null);

  // Add state for course/quiz/assignment data
  const [courses, setCourses] = useState([]);
  const [allQuizzes, setAllQuizzes] = useState([]);
  const [allAssignments, setAllAssignments] = useState({});
  const [assignmentMarksMap, setAssignmentMarksMap] = useState({});

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

  // Fetch all courses (for progress, etc)
  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await fetch("http://localhost:5000/api/enrollments/enroll-courses", {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!res.ok) throw new Error("Failed to fetch dashboard data");
        const result = await res.json();
        setCourses(result.courses || []);
      } catch (err) {
        // Optionally handle error
      }
    };
    fetchCourses();
  }, []);

  // Fetch all quizzes for all courses
  useEffect(() => {
    const fetchAllQuizzes = async () => {
      try {
        const token = localStorage.getItem("token");
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

  // Fetch all assignments for all courses
  useEffect(() => {
    const fetchAllAssignments = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await fetch("http://localhost:5000/api/submissions/student/assignments", {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!res.ok) throw new Error("Failed to fetch all assignments");
        const data = await res.json();
        const assignmentsObj = {};
        (data.assignmentsByCourse || []).forEach(courseBlock => {
          assignmentsObj[courseBlock.courseId] = courseBlock.assignments;
        });
        setAllAssignments(assignmentsObj);
      } catch (err) {
        // Optionally handle error
      }
    };
    fetchAllAssignments();
  }, []);

  // Fetch student submissions to get marks for assignments
  useEffect(() => {
    const fetchAssignmentMarks = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await fetch("http://localhost:5000/api/submissions/student", {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!res.ok) throw new Error("Failed to fetch assignment submissions");
        const data = await res.json();
        // Build a map: assignmentId -> marksObtained
        const map = {};
        if (Array.isArray(data.submissions)) {
          data.submissions.forEach(sub => {
            if (sub.assignment && sub.assignment._id && typeof sub.marksObtained === "number") {
              map[sub.assignment._id] = sub.marksObtained;
            }
          });
        }
        setAssignmentMarksMap(map);
      } catch (err) {
        // Optionally handle error
      }
    };
    fetchAssignmentMarks();
  }, []);

  // Fetch certificates (same logic as StudentCertificateCard)
  useEffect(() => {
    const fetchCertificates = async () => {
      setCertLoading(true);
      setCertError(null);
      try {
        const token = localStorage.getItem("token");
        const res = await fetch("http://localhost:5000/api/certificates/my-certificates", {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!res.ok) throw new Error("Failed to fetch certificates");
        const data = await res.json();
        setCertificates(data.certificates || []);
      } catch (err) {
        setCertError(err.message);
      } finally {
        setCertLoading(false);
      }
    };
    fetchCertificates();
  }, []);

  const handleDownload = async (lessonId) => {
    const token = localStorage.getItem("token");
    try {
      const response = await fetch(`http://localhost:5000/api/download/lesson/${lessonId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const contentType = response.headers.get("content-type");
      if (contentType && contentType.includes("application/json")) {
        const data = await response.json();
        if (!response.ok) {
          alert(data.message || "Access denied or download failed.");
          return;
        }
        // If backend returns a URL (Cloudinary/external), trigger download or open in new tab
        if (data.url) {
          // For Cloudinary, force download if possible
          let downloadUrl = data.url;
          if (downloadUrl.includes("res.cloudinary.com")) {
            downloadUrl = downloadUrl.replace(/\/upload\//, "/upload/fl_attachment/");
          }
          const link = document.createElement("a");
          link.href = downloadUrl;
          link.setAttribute("download", "");
          link.rel = "noopener noreferrer";
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
          return;
        }
        alert("Access denied or download failed.");
        return;
      }
      if (!response.ok) {
        alert("Access denied or download failed.");
        return;
      }
      // Local file: download as blob
      const blob = await response.blob();
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

  // --- Download student report as CSV ---
  const handleDownloadCSV = () => {
    if (!courses.length) return;
    const csvRows = [];
    csvRows.push([
      'Course Name', 'Organization', 'Date Earned', 'Certificate ID', 'Progress (%)', 'Quiz Score', 'Assignment Marks', 'Completed', 'Certificate Issued'
    ].join(','));
    courses.forEach(course => {
      // Find certificate for this course
      const cert = certificates.find(c => String(c.courseId) === String(course.courseId));
      // Find all quizzes for this course
      const quizzesForCourse = allQuizzes.filter(q => String(q.courseId) === String(course.courseId));
      // Find all assignments for this course
      const assignmentsForCourse = Array.isArray(allAssignments[course.courseId]) ? allAssignments[course.courseId] : [];

      // Calculate average quiz score (or blank if none)
      let quizScore = "";
      if (quizzesForCourse.length > 0) {
        const scores = quizzesForCourse.map(q => typeof q.score === "number" ? q.score : null).filter(s => s !== null);
        if (scores.length > 0) {
          quizScore = (scores.reduce((a, b) => a + b, 0) / scores.length).toFixed(2);
        }
      }

      // Calculate total assignment marks (or blank if none)
      let assignmentMarks = "";
      if (assignmentsForCourse.length > 0) {
        // Use assignmentMarksMap to get marks for each assignment
        const marks = assignmentsForCourse.map(a =>
          typeof assignmentMarksMap[a._id] === "number"
            ? assignmentMarksMap[a._id]
            : typeof a.marksObtained === "number"
            ? a.marksObtained
            : typeof a.marks === "number"
            ? a.marks
            : typeof a.score === "number"
            ? a.score
            : null
        ).filter(m => m !== null);
        if (marks.length > 0) {
          assignmentMarks = marks.reduce((a, b) => a + b, 0);
        } else {
          assignmentMarks = "-";
        }
      } else {
        assignmentMarks = "-";
      }

      // Progress
      const progress = typeof course.progress === "number" ? course.progress : "";

      // Date Earned
      let dateEarnedStr = "";
      if (cert && cert.dateEarned) {
        const dateObj = new Date(cert.dateEarned);
        if (!isNaN(dateObj)) {
          dateEarnedStr = dateObj.toLocaleDateString();
        }
      }

      csvRows.push([
        '"' + (course.title || '') + '"',
        '"' + (cert?.organization || '') + '"',
        dateEarnedStr,
        cert?.certificateId || '',
        progress,
        quizScore,
        assignmentMarks,
        course.completed ? 'Yes' : 'No',
        cert?.certificateId ? 'Yes' : 'No'
      ].join(','));
    });
    const csvContent = csvRows.join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `student_report_${new Date().toISOString().slice(0,10)}.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  // --- Download student report as PDF ---
  const handleDownloadPDF = async () => {
    if (!courses.length) return;
    const jsPDF = (await import('jspdf')).default;
    const autoTable = (await import('jspdf-autotable')).default;
    const doc = new jsPDF();
    doc.text('Student Courses & Certificates Report', 14, 16);
    const tableColumn = [
      'Course Name', 'Organization', 'Date Earned', 'Certificate ID', 'Progress (%)', 'Quiz Score', 'Assignment Marks', 'Completed', 'Certificate Issued'
    ];
    const tableRows = courses.map(course => {
      const cert = certificates.find(c => String(c.courseId) === String(course.courseId));
      const quizzesForCourse = allQuizzes.filter(q => String(q.courseId) === String(course.courseId));
      const assignmentsForCourse = Array.isArray(allAssignments[course.courseId]) ? allAssignments[course.courseId] : [];

      let quizScore = "";
      if (quizzesForCourse.length > 0) {
        const scores = quizzesForCourse.map(q => typeof q.score === "number" ? q.score : null).filter(s => s !== null);
        if (scores.length > 0) {
          quizScore = (scores.reduce((a, b) => a + b, 0) / scores.length).toFixed(2);
        }
      }

      let assignmentMarks = "";
      if (assignmentsForCourse.length > 0) {
        // Use assignmentMarksMap to get marks for each assignment
        const marks = assignmentsForCourse.map(a =>
          typeof assignmentMarksMap[a._id] === "number"
            ? assignmentMarksMap[a._id]
            : typeof a.marksObtained === "number"
            ? a.marksObtained
            : typeof a.marks === "number"
            ? a.marks
            : typeof a.score === "number"
            ? a.score
            : null
        ).filter(m => m !== null);
        if (marks.length > 0) {
          assignmentMarks = marks.reduce((a, b) => a + b, 0);
        } else {
          assignmentMarks = "-";
        }
      } else {
        assignmentMarks = "-";
      }

      const progress = typeof course.progress === "number" ? course.progress : "";

      let dateEarnedStr = "";
      if (cert && cert.dateEarned) {
        const dateObj = new Date(cert.dateEarned);
        if (!isNaN(dateObj)) {
          dateEarnedStr = dateObj.toLocaleDateString();
        }
      }

      return [
        course.title || '',
        cert?.organization || '',
        dateEarnedStr,
        cert?.certificateId || '',
        progress,
        quizScore,
        assignmentMarks,
        course.completed ? 'Yes' : 'No',
        cert?.certificateId ? 'Yes' : 'No'
      ];
    });
    autoTable(doc, {
      head: [tableColumn],
      body: tableRows,
      startY: 22,
      styles: { fontSize: 8 },
      headStyles: { fillColor: [59, 130, 246] },
    });
    doc.save(`student_report_${new Date().toISOString().slice(0,10)}.pdf`);
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
                      <td className="p-3 text-gray-700">
                        {
                          typeof h.courseTitle === "string" && h.courseTitle.trim() && h.courseTitle !== "-"
                            ? h.courseTitle
                            : (
                                typeof h.filePath === "string"
                                  ? (() => {
                                      const match = h.filePath.match(/courses\/([^\/]+)/);
                                      return match && match[1] ? decodeURIComponent(match[1]) : "-";
                                    })()
                                  : "-"
                              )
                        }
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
      {/* Student Certificate Report Table */}
      <div className="bg-white rounded-xl shadow-lg p-4 md:p-8 mt-10">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-4 gap-2">
          <h2 className="text-xl md:text-2xl font-bold text-blue-700">
            Student Certificates & Course Report
          </h2>
          <div className="flex gap-2">
            <button
              className="px-3 py-1 rounded border bg-green-600 text-white"
              onClick={handleDownloadCSV}
              disabled={certLoading || !courses.length}
            >
              Download CSV
            </button>
            <button
              className="px-3 py-1 rounded border bg-red-600 text-white"
              onClick={handleDownloadPDF}
              disabled={certLoading || !courses.length}
            >
              Download PDF
            </button>
          </div>
        </div>
        {certLoading ? (
          <div className="text-gray-500">Loading certificates...</div>
        ) : certError ? (
          <div className="text-red-500">{certError}</div>
        ) : courses.length === 0 ? (
          <div className="text-gray-500">You have not enrolled in any courses yet.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead>
                <tr className="bg-blue-100">
                  <th className="p-3 text-left font-semibold text-gray-700">Course Name</th>
                  <th className="p-3 text-left font-semibold text-gray-700">Organization</th>
                  <th className="p-3 text-left font-semibold text-gray-700">Date Earned</th>
                  <th className="p-3 text-left font-semibold text-gray-700">Certificate ID</th>
                  <th className="p-3 text-left font-semibold text-gray-700">Progress (%)</th>
                  <th className="p-3 text-left font-semibold text-gray-700">Quiz Score</th>
                  <th className="p-3 text-left font-semibold text-gray-700">Assignment Marks</th>
                  <th className="p-3 text-left font-semibold text-gray-700">Completed</th>
                  <th className="p-3 text-left font-semibold text-gray-700">Certificate Issued</th>
                </tr>
              </thead>
              <tbody>
                {courses.map(course => {
                  const cert = certificates.find(c => String(c.courseId) === String(course.courseId));
                  const quizzesForCourse = allQuizzes.filter(q => String(q.courseId) === String(course.courseId));
                  const assignmentsForCourse = Array.isArray(allAssignments[course.courseId]) ? allAssignments[course.courseId] : [];
                  // Calculate average quiz score (or blank if none)
                  let quizScore = "";
                  if (quizzesForCourse.length > 0) {
                    const scores = quizzesForCourse.map(q => typeof q.score === "number" ? q.score : null).filter(s => s !== null);
                    if (scores.length > 0) {
                      quizScore = (scores.reduce((a, b) => a + b, 0) / scores.length).toFixed(2);
                    }
                  }
                  // Calculate total assignment marks (or blank if none)
                  let assignmentMarks = "";
                  if (assignmentsForCourse.length > 0) {
                    const marks = assignmentsForCourse.map(a =>
                      typeof assignmentMarksMap[a._id] === "number"
                        ? assignmentMarksMap[a._id]
                        : typeof a.marksObtained === "number"
                        ? a.marksObtained
                        : typeof a.marks === "number"
                        ? a.marks
                        : typeof a.score === "number"
                        ? a.score
                        : null
                    ).filter(m => m !== null);
                    if (marks.length > 0) {
                      assignmentMarks = marks.reduce((a, b) => a + b, 0);
                    } else {
                      assignmentMarks = "-";
                    }
                  } else {
                    assignmentMarks = "-";
                  }
                  const progress = typeof course.progress === "number" ? course.progress : "";
                  let dateEarnedStr = "";
                  if (cert && cert.dateEarned) {
                    const dateObj = new Date(cert.dateEarned);
                    if (!isNaN(dateObj)) {
                      dateEarnedStr = dateObj.toLocaleDateString();
                    }
                  }
                  return (
                    <tr key={course.courseId}>
                      <td className="p-3">{course.title || ''}</td>
                      <td className="p-3">{cert?.organization || ''}</td>
                      <td className="p-3">{dateEarnedStr}</td>
                      <td className="p-3">{cert?.certificateId || ''}</td>
                      <td className="p-3">{progress}</td>
                      <td className="p-3">{quizScore}</td>
                      <td className="p-3">{assignmentMarks}</td>
                      <td className="p-3">{course.completed ? 'Yes' : 'No'}</td>
                      <td className="p-3">{cert?.certificateId ? 'Yes' : 'No'}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default DownloadPage;
