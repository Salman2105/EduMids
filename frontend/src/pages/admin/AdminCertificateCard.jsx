import React, { useEffect, useState } from "react";

export default function AdminCertificateCard() {
  const [certificates, setCertificates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [refresh, setRefresh] = useState(false);
  const [revokedCertificates, setRevokedCertificates] = useState([]);
  const [revokedLoading, setRevokedLoading] = useState(true);
  const [revokedError, setRevokedError] = useState("");
  const [history, setHistory] = useState({}); // enrollmentId -> history array
  const [historyLoading, setHistoryLoading] = useState(""); // enrollmentId
  const [showHistory, setShowHistory] = useState(""); // enrollmentId
  const [studentSearch, setStudentSearch] = useState("");
  const [courseSearch, setCourseSearch] = useState("");

  useEffect(() => {
    const fetchCertificates = async () => {
      setLoading(true);
      setError("");
      try {
        const token = localStorage.getItem("token");
        const res = await fetch("http://localhost:5000/api/admin/certificates/issued-certificates", {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json();
        if (res.ok) {
          // Expect backend to return enrollmentId for each certificate
          setCertificates(data.issuedCertificates || []);
        } else {
          setError(data.message || "Failed to fetch certificates.");
        }
      } catch (err) {
        setError("Error fetching certificates.");
      }
      setLoading(false);
    };
    fetchCertificates();
  }, [refresh]);

  useEffect(() => {
    const fetchRevoked = async () => {
      setRevokedLoading(true);
      setRevokedError("");
      try {
        const token = localStorage.getItem("token");
        const res = await fetch("http://localhost:5000/api/admin/certificates/revoked-certificates", {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json();
        if (res.ok) {
          setRevokedCertificates(data || []);
        } else {
          setRevokedError(data.message || "Failed to fetch revoked certificates.");
        }
      } catch (err) {
        setRevokedError("Error fetching revoked certificates.");
      }
      setRevokedLoading(false);
    };
    fetchRevoked();
  }, [refresh]);

  // Revoke certificate
  const handleRevoke = async (enrollmentId) => {
    if (!window.confirm("Revoke this certificate?")) return;
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`http://localhost:5000/api/admin/certificates/revoke-certificate/${enrollmentId}`,
        {
          method: "DELETE",
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      const data = await res.json();
      if (res.ok) {
        alert("Certificate revoked successfully!");
        setRefresh((r) => !r);
      } else {
        alert(data.message || "Failed to revoke certificate.");
      }
    } catch (err) {
      alert("Error revoking certificate.");
    }
  };

  // View reissue history
  const handleViewHistory = async (enrollmentId) => {
    alert("Implement view reissue history modal or page. EnrollmentId: " + enrollmentId);
  };

  // Re-issue certificate
  const handleReissue = async (enrollmentId) => {
    if (!window.confirm("Re-issue this certificate?")) return;
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`http://localhost:5000/api/admin/certificates/reissue-certificate/${enrollmentId}`,
        {
          method: "POST",
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      const data = await res.json();
      if (res.ok) {
        alert("Certificate re-issued successfully!");
        setRefresh((r) => !r);
      } else {
        alert(data.message || "Failed to re-issue certificate.");
      }
    } catch (err) {
      alert("Error re-issuing certificate.");
    }
  };

  // Fetch reissue history for a revoked certificate
  const handleViewReissueHistory = async (enrollmentId) => {
    if (showHistory === enrollmentId) {
      setShowHistory("");
      return;
    }
    setHistoryLoading(enrollmentId);
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`http://localhost:5000/api/admin/certificates/certificate-reissue-history/${enrollmentId}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      const data = await res.json();
      if (res.ok) {
        setHistory((prev) => ({ ...prev, [enrollmentId]: data.history || [] }));
        setShowHistory(enrollmentId);
      } else {
        alert(data.message || "Failed to fetch reissue history.");
      }
    } catch (err) {
      alert("Error fetching reissue history.");
    }
    setHistoryLoading("");
  };

  // Filtered issued certificates
  const filteredCertificates = certificates.filter(cert => {
    const studentMatch = cert.studentName?.toLowerCase().includes(studentSearch.toLowerCase());
    const courseMatch = cert.courseTitle?.toLowerCase().includes(courseSearch.toLowerCase());
    return (!studentSearch || studentMatch) && (!courseSearch || courseMatch);
  });

  // Filtered revoked certificates
  const filteredRevokedCertificates = revokedCertificates.filter(cert => {
    const studentMatch = cert.student?.name?.toLowerCase().includes(studentSearch.toLowerCase());
    const courseMatch = cert.course?.title?.toLowerCase().includes(courseSearch.toLowerCase());
    return (!studentSearch || studentMatch) && (!courseSearch || courseMatch);
  });

  return (
    <div className="max-w-5xl mx-auto mt-8 p-6 bg-white rounded shadow">
      <h2 className="text-2xl font-bold mb-6">Issued Certificates</h2>
      {/* Search/Filter UI */}
      <div className="flex gap-4 mb-4">
        <input
          type="text"
          className="border px-3 py-1 rounded w-60"
          placeholder="Search by student name"
          value={studentSearch}
          onChange={e => setStudentSearch(e.target.value)}
        />
        <input
          type="text"
          className="border px-3 py-1 rounded w-60"
          placeholder="Search by course title"
          value={courseSearch}
          onChange={e => setCourseSearch(e.target.value)}
        />
      </div>
      {loading && <p>Loading certificates...</p>}
      {error && <p className="text-red-600">{error}</p>}
      {!loading && filteredCertificates.length === 0 && !error && (
        <p>No certificates issued yet.</p>
      )}
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead>
            <tr>
              <th className="px-4 py-2">Student Name</th>
              <th className="px-4 py-2">Student Email</th>
              <th className="px-4 py-2">Course</th>
              <th className="px-4 py-2">Date Completed</th>
              <th className="px-4 py-2">Enrollment ID</th>
              <th className="px-4 py-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredCertificates.map((cert, idx) => (
              <tr key={idx} className="bg-white even:bg-gray-50">
                <td className="px-4 py-2 font-semibold">{cert.studentName}</td>
                <td className="px-4 py-2">{cert.studentEmail}</td>
                <td className="px-4 py-2">{cert.courseTitle}</td>
                <td className="px-4 py-2">{cert.dateCompleted ? new Date(cert.dateCompleted).toLocaleDateString() : "-"}</td>
                <td className="px-4 py-2">{cert.enrollmentId || "-"}</td>
                <td className="px-4 py-2 flex gap-2">
                  <button
                    className="bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700 text-xs"
                    onClick={() => handleRevoke(cert.enrollmentId)}
                    disabled={!cert.enrollmentId}
                  >
                    Revoke
                  </button>
                  <button
                    className="bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700 text-xs"
                    onClick={() => handleReissue(cert.enrollmentId)}
                    disabled={!cert.enrollmentId}
                  >
                    Re-Issue
                  </button>
                  <button
                    className="bg-gray-500 text-white px-3 py-1 rounded hover:bg-gray-700 text-xs"
                    onClick={() => handleViewHistory(cert.enrollmentId)}
                    disabled={!cert.enrollmentId}
                  >
                    View History
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Revoked Certificates Section */}
      <h2 className="text-2xl font-bold mt-12 mb-6">Revoked Certificates</h2>
      {revokedLoading && <p>Loading revoked certificates...</p>}
      {revokedError && <p className="text-red-600">{revokedError}</p>}
      {!revokedLoading && filteredRevokedCertificates.length === 0 && !revokedError && (
        <p>No revoked certificates found.</p>
      )}
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead>
            <tr>
              <th className="px-4 py-2">Student Name</th>
              <th className="px-4 py-2">Student Email</th>
              <th className="px-4 py-2">Course</th>
              <th className="px-4 py-2">Date Revoked</th>
              <th className="px-4 py-2">Enrollment ID</th>
              <th className="px-4 py-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredRevokedCertificates.map((cert, idx) => (
              <React.Fragment key={cert._id}>
                <tr className="bg-white even:bg-gray-50">
                  <td className="px-4 py-2 font-semibold">{cert.student?.name}</td>
                  <td className="px-4 py-2">{cert.student?.email}</td>
                  <td className="px-4 py-2">{cert.course?.title}</td>
                  <td className="px-4 py-2">{cert.updatedAt ? new Date(cert.updatedAt).toLocaleDateString() : "-"}</td>
                  <td className="px-4 py-2">{cert._id}</td>
                  <td className="px-4 py-2">
                    <button
                      className="bg-gray-600 text-white px-3 py-1 rounded hover:bg-gray-700 text-xs"
                      onClick={() => handleViewReissueHistory(cert._id)}
                    >
                      {historyLoading === cert._id ? "Loading..." : showHistory === cert._id ? "Hide History" : "View Reissue History"}
                    </button>
                  </td>
                </tr>
                {showHistory === cert._id && (
                  <tr>
                    <td colSpan={6} className="bg-gray-50 px-4 py-2">
                      <strong>Reissue History:</strong>
                      {history[cert._id] && history[cert._id].length > 0 ? (
                        <ul className="list-disc ml-6">
                          {history[cert._id].map((item, i) => (
                            <li key={i}>
                              {item.reissuedAt ? new Date(item.reissuedAt).toLocaleString() : "-"} by {item.adminId?.name || "Unknown Admin"} ({item.adminId?.email || "-"})
                            </li>
                          ))}
                        </ul>
                      ) : (
                        <span className="ml-2">No reissue history found.</span>
                      )}
                    </td>
                  </tr>
                )}
              </React.Fragment>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
