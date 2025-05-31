import React, { useEffect, useState } from "react";

export default function CertificateCard() {
  const [courses, setCourses] = useState([]);
  const [search, setSearch] = useState("");
  const [filteredCourses, setFilteredCourses] = useState([]);
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [enrollments, setEnrollments] = useState([]);
  const [message, setMessage] = useState("");
  const [loadingId, setLoadingId] = useState(""); // Track which student is being processed

  // Fetch teacher's courses on mount
  useEffect(() => {
    const fetchCourses = async () => {
      const token = localStorage.getItem("token");
      const res = await fetch("http://localhost:5000/api/teacher/my-courses", {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      setCourses(data);
      setFilteredCourses(data);
    };
    fetchCourses();
  }, []);

  // Filter courses by search
  useEffect(() => {
    if (!search.trim()) {
      setFilteredCourses(courses);
    } else {
      setFilteredCourses(
        courses.filter(
          (c) =>
            c.title.toLowerCase().includes(search.toLowerCase()) ||
            c._id === search.trim()
        )
      );
    }
  }, [search, courses]);

  // Fetch enrollments for selected course
  useEffect(() => {
    if (!selectedCourse) return;
    const fetchEnrollments = async () => {
      const token = localStorage.getItem("token");
      const res = await fetch(
        `http://localhost:5000/api/enrollments/course/${selectedCourse._id}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      const data = await res.json();
      setEnrollments(data);
    };
    fetchEnrollments();
  }, [selectedCourse]);

  // Issue certificate to a student
  const handleIssueCertificate = async (studentId) => {
    setLoadingId(studentId);
    setMessage("");
    try {
      const token = localStorage.getItem("token");
      const res = await fetch("http://localhost:5000/api/certificates/issue", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          courseId: selectedCourse._id,
          studentId,
        }),
      });
      const data = await res.json();
      if (res.ok) {
        setMessage("Certificate issued successfully!");
        setEnrollments((prev) =>
          prev.map((enr) =>
            enr.student._id === studentId
              ? { ...enr, certificateIssued: true }
              : enr
          )
        );
      } else {
        setMessage(data.message || "Failed to issue certificate.");
      }
    } catch (err) {
      setMessage("Error issuing certificate.");
    }
    setLoadingId("");
  };

  return (
    <div className="max-w-3xl mx-auto mt-8 p-6 bg-white rounded shadow">
      <h2 className="text-2xl font-bold mb-4">Issue Certificates</h2>
      {message && (
        <div className="mb-4 text-center text-sm text-blue-700">{message}</div>
      )}

      {/* Student Search and Course Selector */}
      <div className="mb-4">
        <label className="block mb-1 font-semibold">Search Student</label>
        <input
          type="text"
          className="border px-3 py-2 rounded w-full"
          placeholder="Enter student name or email"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>
      <div className="mb-6">
        <label className="block mb-1 font-semibold">Select Course</label>
        <select
          className="border px-3 py-2 rounded w-full"
          value={selectedCourse ? selectedCourse._id : ""}
          onChange={(e) => {
            const course = courses.find((c) => c._id === e.target.value);
            setSelectedCourse(course);
            setMessage("");
          }}
        >
          <option value="">-- Select a course --</option>
          {courses.map((course) => (
            <option key={course._id} value={course._id}>
              {course.title} ({course._id})
            </option>
          ))}
        </select>
      </div>

      {/* Enrolled Students List */}
      {selectedCourse && (
        <div>
          <h3 className="text-lg font-semibold mb-2">
            Students Who Completed "{selectedCourse.title}"
          </h3>
          {enrollments.filter((enr) => enr.progress >= 100).length === 0 && (
            <p className="text-slate-500">
              No students have completed this course yet.
            </p>
          )}
          <ul>
            {enrollments
              .filter(
                (enr) =>
                  enr.progress >= 100 &&
                  (search.trim() === "" ||
                    enr.student.name
                      .toLowerCase()
                      .includes(search.toLowerCase()) ||
                    enr.student.email
                      .toLowerCase()
                      .includes(search.toLowerCase()))
              )
              .map((enr) => (
                <li
                  key={enr.student._id}
                  className="mb-4 flex items-center justify-between border-b pb-2"
                >
                  <span>
                    {enr.student.name} ({enr.student.email})
                  </span>
                  {enr.certificateIssued ? (
                    <span className="text-green-600 font-semibold">
                      Certificate Issued
                    </span>
                  ) : (
                    <button
                      className="bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700"
                      disabled={loadingId === enr.student._id}
                      onClick={() => handleIssueCertificate(enr.student._id)}
                    >
                      {loadingId === enr.student._id
                        ? "Issuing..."
                        : "Issue Certificate"}
                    </button>
                  )}
                </li>
              ))}
          </ul>
        </div>
      )}
    </div>
  );
}
