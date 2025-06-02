import React, { useEffect, useState } from "react";

export default function AdminReportCard() {
  const [report, setReport] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [filter, setFilter] = useState("none"); // none, high-enrollment, high-certificate

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
    <div className="max-w-7xl mx-auto mt-8 p-6 bg-white rounded shadow">
      <h2 className="text-2xl font-bold mb-6">Courses & Users Report</h2>
      <div className="mb-4 flex gap-2">
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
                <th className="px-4 py-2">Details</th>
              </tr>
            </thead>
            <tbody>
              {filteredReport.map((course) => (
                <React.Fragment key={course.courseId}>
                  <tr className="bg-white even:bg-gray-50">
                    <td className="px-4 py-2 font-semibold">{course.title || "-"}</td>
                    <td className="px-4 py-2">{course.category || "-"}</td>
                    <td className="px-4 py-2">{course.price != null ? `$${course.price}` : "-"}</td>
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
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
