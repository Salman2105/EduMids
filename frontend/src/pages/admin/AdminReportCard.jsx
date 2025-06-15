import React, { useEffect, useState } from "react";

export default function AdminReportCard() {
  const [report, setReport] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [filter, setFilter] = useState("none"); // none, high-enrollment, high-certificate
  // New: Store lessons, quizzes, assignments by courseId
  const [courseDetails, setCourseDetails] = useState({});

  useEffect(() => {
    const fetchReport = async () => {
      setLoading(true);
      setError("");
      try {
        const token = localStorage.getItem("token");
        const res = await fetch("http://localhost:5000/api/admin/courses-report", {
          headers: { Authorization: `Bearer ${token}` },
        });
        let data;
        try {
          data = await res.json();
        } catch (jsonErr) {
          setError("Invalid server response.");
          setLoading(false);
          return;
        }
        if (res.ok) {
          setReport(Array.isArray(data.report) ? data.report : []);
        } else {
          setError(data.message || "Failed to fetch report.");
        }
      } catch (err) {
        setError("Error fetching report.");
      }
      setLoading(false);
    };
    fetchReport();
  }, []);

  // Fetch lessons, quizzes, assignments for each course in report
  useEffect(() => {
    const fetchDetails = async () => {
      const token = localStorage.getItem("token");
      const details = {};
      for (const course of report) {
        const courseId = course.courseId || course._id;
        // Fetch lessons
        let lessons = [];
        try {
          const res = await fetch(`http://localhost:5000/api/lessons/course/${courseId}`, {
            headers: { Authorization: `Bearer ${token}` },
          });
          const data = await res.json();
          lessons = Array.isArray(data.lessons) ? data.lessons : [];
        } catch (err) {
          console.error("Lessons fetch error for course", courseId, err);
        }
        // Fetch quizzes
        let quizzes = [];
        try {
          const res = await fetch(`http://localhost:5000/api/quizzes/course/${courseId}`, {
            headers: { Authorization: `Bearer ${token}` },
          });
          const data = await res.json();
          quizzes = Array.isArray(data) ? data : [];
        } catch (err) {
          console.error("Quizzes fetch error for course", courseId, err);
        }
        // Fetch assignments
        let assignments = [];
        try {
          const res = await fetch(`http://localhost:5000/api/assignments/course/${courseId}`, {
            headers: { Authorization: `Bearer ${token}` },
          });
          const data = await res.json();
          // Debug log
          console.log("Assignments API response for course", courseId, data);
          if (Array.isArray(data)) {
            assignments = data;
          } else if (Array.isArray(data.assignments)) {
            assignments = data.assignments;
          } else {
            assignments = [];
          }
        } catch (err) {
          console.error("Assignments fetch error for course", courseId, err);
          assignments = [];
        }
        details[courseId] = { lessons, quizzes, assignments };
      }
      setCourseDetails(details);
    };
    if (report.length > 0) fetchDetails();
  }, [report]);

  // Download report as CSV
  const handleDownloadCSV = () => {
    if (!report.length) return;
    // Flatten report for CSV
    const csvRows = [];
    // Header
    csvRows.push([
      'Course Title', 'Category', 'Price', 'Teacher Name', 'Teacher Email', 'Total Enrolled', 'Total Completed', 'Total Certified', 'Assignments'
    ].join(','));
    // Data
    report.forEach(course => {
      const courseId = course.courseId || course._id;
      const assignmentsCount = courseDetails[courseId]?.assignments?.length ?? 0;
      csvRows.push([
        '"' + (course.title || '') + '"',
        '"' + (course.category || '') + '"',
        course.price != null ? course.price : '',
        '"' + (course.teacher?.name || '') + '"',
        '"' + (course.teacher?.email || '') + '"',
        course.totalEnrolled ?? 0,
        course.totalCompleted ?? 0,
        course.totalCertified ?? 0,
        assignmentsCount
      ].join(','));
    });
    const csvContent = csvRows.join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `admin_report_${new Date().toISOString().slice(0,10)}.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  // Download report as PDF
  const handleDownloadPDF = async () => {
    if (!report.length) return;
    // Dynamically import jsPDF and autoTable
    const jsPDF = (await import('jspdf')).default;
    const autoTable = (await import('jspdf-autotable')).default;
    const doc = new jsPDF();
    doc.text('Admin Courses & Users Report', 14, 16);
    const tableColumn = [
      'Course Title', 'Category', 'Price', 'Teacher Name', 'Teacher Email', 'Total Enrolled', 'Total Completed', 'Total Certified', 'Assignments'
    ];
    const tableRows = report.map(course => {
      const courseId = course.courseId || course._id;
      const assignmentsCount = courseDetails[courseId]?.assignments?.length ?? 0;
      return [
        course.title || '',
        course.category || '',
        course.price != null ? course.price : '',
        course.teacher?.name || '',
        course.teacher?.email || '',
        course.totalEnrolled ?? 0,
        course.totalCompleted ?? 0,
        course.totalCertified ?? 0,
        assignmentsCount
      ];
    });
    autoTable(doc, {
      head: [tableColumn],
      body: tableRows,
      startY: 22,
      styles: { fontSize: 8 },
      headStyles: { fillColor: [34, 197, 94] },
    });
    doc.save(`admin_report_${new Date().toISOString().slice(0,10)}.pdf`);
  };

  // Derived sorted report
  const getFilteredReport = () => {
    if (filter === "high-enrollment") {
      return [...report].sort((a, b) => b.totalEnrolled - a.totalEnrolled);
    }
    if (filter === "high-certificate") {
      return [...report].sort((a, b) => b.totalCertified - a.totalCertified);
    }
    return report;
  };

  const filteredReport = getFilteredReport();

  return (
    <div className="max-w-7xl mx-auto p-4 md:p-8 min-h-screen bg-gradient-to-br from-blue-50 to-white">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8 gap-4">
        <div>
          <h2 className="text-3xl md:text-4xl font-extrabold text-blue-800 mb-2">Courses & Users Report</h2>
          <p className="text-gray-600 text-base md:text-lg">
            Download and analyze course, user, certificate, and assignment statistics.
          </p>
        </div>
        <img
          src="/assets/certificate.jpg"
          alt="Certificates"
          className="w-24 h-24 md:w-32 md:h-32 object-contain hidden md:block"
        />
      </div>
      <div className="mb-4 flex gap-2">
        <button
          className="px-3 py-1 rounded border bg-green-600 text-white"
          onClick={handleDownloadCSV}
        >
          Download CSV
        </button>
        <button
          className="px-3 py-1 rounded border bg-red-600 text-white"
          onClick={handleDownloadPDF}
        >
          Download PDF
        </button>
        <button
          className={`px-3 py-1 rounded border ${filter === "none" ? "bg-blue-600 text-white" : "bg-gray-100"}`}
          onClick={() => setFilter("none")}
        >
          All Courses
        </button>
        <button
          className={`px-3 py-1 rounded border ${filter === "high-enrollment" ? "bg-blue-600 text-white" : "bg-gray-100"}`}
          onClick={() => setFilter("high-enrollment")}
        >
          Highest Enrollment
        </button>
        <button
          className={`px-3 py-1 rounded border ${filter === "high-certificate" ? "bg-blue-600 text-white" : "bg-gray-100"}`}
          onClick={() => setFilter("high-certificate")}
        >
          Highest Certificates
        </button>
      </div>
      {loading && <p>Loading report...</p>}
      {error && <p className="text-red-600">{error}</p>}
      {!loading && !error && filteredReport.length === 0 && <p>No data found.</p>}
      {!loading && !error && filteredReport.length > 0 && (
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead>
              <tr>
                <th className="px-4 py-2">Course Title</th>
                <th className="px-4 py-2">Category</th>
                <th className="px-4 py-2">Price</th>
                <th className="px-4 py-2">Teacher</th>
                <th className="px-4 py-2">Total Enrolled</th>
                <th className="px-4 py-2">Total Completed</th>
                <th className="px-4 py-2">Total Certified</th>
                <th className="px-4 py-2">Assignments</th>
                <th className="px-4 py-2">Details</th>
              </tr>
            </thead>
            <tbody>
              {filteredReport.map((course) => {
                const courseId = course.courseId || course._id;
                const details = courseDetails[courseId] || {};
                return (
                  <React.Fragment key={courseId}>
                    <tr className="bg-white even:bg-gray-50">
                      <td className="px-4 py-2 font-semibold">
                        {course.title || "-"}
                        {/* Lessons, Quizzes, Assignments */}
                        <div className="mt-2 text-xs text-gray-700">
                          <div>
                            <span className="font-semibold">Lessons:</span>
                            {details.lessons && details.lessons.length > 0 ? (
                              <ul className="list-disc ml-4">
                                {details.lessons.map((l) => (
                                  <li key={l._id || l.lessonId}>{l.title}</li>
                                ))}
                              </ul>
                            ) : (
                              <span className="ml-2 text-gray-400">None</span>
                            )}
                          </div>
                          <div className="mt-1">
                            <span className="font-semibold">Quizzes:</span>
                            {details.quizzes && details.quizzes.length > 0 ? (
                              <ul className="list-disc ml-4">
                                {details.quizzes.map((q) => (
                                  <li key={q._id || q.quizId}>{q.title}</li>
                                ))}
                              </ul>
                            ) : (
                              <span className="ml-2 text-gray-400">None</span>
                            )}
                          </div>
                          <div className="mt-1">
                            <span className="font-semibold">Assignments:</span>
                            {Array.isArray(details.assignments) && details.assignments.length > 0 ? (
                              <ul className="list-disc ml-4">
                                {details.assignments.map((a, idx) => (
                                  <li key={a._id || a.assignmentId || a.title || idx}>
                                    {a.title || JSON.stringify(a)}
                                  </li>
                                ))}
                              </ul>
                            ) : (
                              <span className="ml-2 text-gray-400">None</span>
                            )}
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-2">{course.category || "-"}</td>
                      <td className="px-4 py-2">{course.price != null ? `${course.price}` : "-"}</td>
                      <td className="px-4 py-2">
                        {course.teacher ? (
                          <>
                            <div>{course.teacher.name || "-"}</div>
                            <div className="text-xs text-gray-500">{course.teacher.email || "-"}</div>
                          </>
                        ) : "-"
                        }
                      </td>
                      <td className="px-4 py-2">{course.totalEnrolled ?? 0}</td>
                      <td className="px-4 py-2">{course.totalCompleted ?? 0}</td>
                      <td className="px-4 py-2">{course.totalCertified ?? 0}</td>
                      <td className="px-4 py-2">
                        {details.assignments ? details.assignments.length : 0}
                      </td>
                      <td className="px-4 py-2">
                        <details>
                          <summary className="cursor-pointer text-blue-600">View</summary>
                          <div className="mt-2">
                            <strong>Enrolled Students:</strong>
                            <ul className="list-disc ml-6">
                              {(course.enrolledStudents?.length ?? 0) === 0 && <li>None</li>}
                              {(course.enrolledStudents || []).map((s, idx) => (
                                <li key={s.studentId || idx}>
                                  {s.name || "Unknown"} ({s.email || "Unknown"}) - Progress: {s.progress ?? 0}%
                                  {s.certificateIssued && <span className="ml-2 text-green-600">[Certificate Issued]</span>}
                                  {s.certificateRevoked && <span className="ml-2 text-red-600">[Revoked]</span>}
                                </li>
                              ))}
                            </ul>
                            <strong className="block mt-2">Completed Students:</strong>
                            <ul className="list-disc ml-6">
                              {(course.completedStudents?.length ?? 0) === 0 && <li>None</li>}
                              {(course.completedStudents || []).map((s, idx) => (
                                <li key={s.studentId || idx}>
                                  {s.name || "Unknown"} ({s.email || "Unknown"}) - Progress: {s.progress ?? 0}%
                                </li>
                              ))}
                            </ul>
                            <strong className="block mt-2">Certified Students:</strong>
                            <ul className="list-disc ml-6">
                              {(course.certifiedStudents?.length ?? 0) === 0 && <li>None</li>}
                              {(course.certifiedStudents || []).map((s, idx) => (
                                <li key={s.studentId || idx}>
                                  {s.name || "Unknown"} ({s.email || "Unknown"}) - Progress: {s.progress ?? 0}%
                                </li>
                              ))}
                            </ul>
                          </div>
                        </details>
                      </td>
                    </tr>
                  </React.Fragment>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
