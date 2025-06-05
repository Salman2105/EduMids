import React, { useEffect, useState } from "react";

export default function StudentCertificateCard() {
  const [certificates, setCertificates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchCertificates = async () => {
      setLoading(true);
      setError(null);
      try {
        const token = localStorage.getItem("token"); // always get fresh token
        const res = await fetch("http://localhost:5000/api/certificates/my-certificates", {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!res.ok) throw new Error("Failed to fetch certificates");
        const data = await res.json();
        setCertificates(data.certificates || []);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchCertificates();
  }, []);

  // Download certificate with auth token
  const handleDownload = async (courseId, courseName) => {
    try {
      const token = localStorage.getItem("token"); // always get fresh token
      const res = await fetch(`http://localhost:5000/api/certificates/certificate/${courseId}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      if (!res.ok) {
        // Try to parse error message from backend
        let errorMsg = "Failed to download certificate";
        try {
          const errData = await res.json();
          if (errData && errData.message) errorMsg = errData.message;
        } catch {}
        throw new Error(errorMsg);
      }
      const blob = await res.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `Certificate-${courseName}.pdf`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      window.URL.revokeObjectURL(url);
    } catch (err) {
      alert(err.message || "Failed to download certificate");
    }
  };

  if (loading) return <div className="p-4">Loading certificates...</div>;
  if (error) return <div className="p-4 text-red-500">{error}</div>;
  if (!certificates.length)
    return <div className="p-4">You have not earned any certificates yet.</div>;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {certificates.map((cert) => (
        <div
          key={cert.certificateId}
          className="bg-white rounded-lg shadow-md p-6 flex flex-col justify-between border border-gray-100 hover:shadow-lg transition-shadow duration-200"
        >
          <div>
            <h2 className="text-xl font-bold text-blue-700 mb-2">{cert.courseName}</h2>
            <div className="text-gray-600 mb-1">Issued by: <span className="font-semibold">{cert.organization}</span></div>
            <div className="text-gray-500 text-sm mb-2">Date Earned: {new Date(cert.dateEarned).toLocaleDateString()}</div>
            <div className="text-xs text-gray-400 mb-2">Certificate ID: {cert.certificateId}</div>
          </div>
          <button
            onClick={() => handleDownload(cert.courseId, cert.courseName)}
            className="mt-4 inline-block bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 text-center text-sm font-medium"
          >
            Download PDF
          </button>
        </div>
      ))}
    </div>
  );
}
