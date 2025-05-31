import React, { useEffect, useState } from "react";

export default function AdminCertificateCard() {
  const [certificates, setCertificates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [refresh, setRefresh] = useState(false);

  useEffect(() => {
    const fetchCertificates = async () => {
      setLoading(true);
      setError("");
      try {
        const token = localStorage.getItem("token");
        const res = await fetch("http://localhost:5000/api/admin/issued-certificates", {
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

  // Revoke certificate
  const handleRevoke = async (enrollmentId) => {
    if (!window.confirm("Revoke this certificate?")) return;
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`http://localhost:5000/api/admin/revoke-certificate/${enrollmentId}`,
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
      const res = await fetch(`http://localhost:5000/api/admin/reissue-certificate/${enrollmentId}`,
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

  return (
    <div className="max-w-5xl mx-auto mt-8 p-6 bg-white rounded shadow">
      <h2 className="text-2xl font-bold mb-6">Issued Certificates</h2>
      {loading && <p>Loading certificates...</p>}
      {error && <p className="text-red-600">{error}</p>}
      {!loading && certificates.length === 0 && !error && (
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
            {certificates.map((cert, idx) => (
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
    </div>
  );
}
