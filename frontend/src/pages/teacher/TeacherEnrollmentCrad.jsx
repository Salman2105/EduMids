{/* <script src="http://localhost:8097"></script> */}

import React, { useEffect, useState } from "react";

export default function TeacherEnrollmentCrad() {
  const [courses, setCourses] = useState([]);
  const [enrollments, setEnrollments] = useState({});
  const [loading, setLoading] = useState(true);
  const [searchCourseId, setSearchCourseId] = useState("");
  const [searchResult, setSearchResult] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem("token");

    // Fetch all courses created by the teacher
    const fetchCourses = async () => {
      try {
        const res = await fetch("http://localhost:5000/api/teacher/my-courses", {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json();
        setCourses(data);

        // For each course, fetch enrolled students
        const enrollmentData = {};
        for (const course of data) {
          const enrollRes = await fetch(
            `http://localhost:5000/api/enrollments/course/${course._id}`,
            { headers: { Authorization: `Bearer ${token}` } }
          );
          const enrollList = await enrollRes.json();
          // Defensive: ensure enrollList is always an array
          enrollmentData[course._id] = Array.isArray(enrollList) ? enrollList : [];
        }
        setEnrollments(enrollmentData);
        setLoading(false);
      } catch (err) {
        setLoading(false);
      }
    };

    fetchCourses();
  }, []);

  // Handle search for course enrollments by course id or course name
  const handleSearch = (e) => {
    e.preventDefault();
    if (!searchCourseId.trim()) {
      setSearchResult(null);
      return;
    }
    const search = searchCourseId.trim().toLowerCase();
    // Search by course _id or course title (case-insensitive)
    const foundCourse = courses.find(
      (c) =>
        c._id === search ||
        c.title.toLowerCase().includes(search)
    );
    if (foundCourse) {
      setSearchResult({
        course: foundCourse,
        students: enrollments[foundCourse._id] || [],
      });
    } else {
      setSearchResult({ course: null, students: [] });
    }
  };

  // Helper to get correct image src
  const getImageSrc = (picture) => {
    if (!picture) return "";
    if (picture.startsWith("http")) return picture;
    // Remove leading slash if present to avoid double slashes
    return picture.startsWith("/") ? picture : `/${picture}`;
  };

  if (loading) return <div>Loading...</div>;

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-6">
        Student Enrollments in Your Courses
      </h2>

      {/* Search Bar */}
      <form
        onSubmit={handleSearch}
        className="mb-8 flex flex-col sm:flex-row gap-2 items-center"
      >
        <input
          type="text"
          placeholder="Enter Course ID or Name to search"
          value={searchCourseId}
          onChange={(e) => setSearchCourseId(e.target.value)}
          className="border px-3 py-2 rounded w-full sm:w-72"
        />
        <button
          type="submit"
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Search
        </button>
      </form>

      {/* Search Result */}
      {searchResult && (
        <div className="mb-8 border rounded-lg p-4 bg-blue-100 shadow">
          <h3 className="text-lg font-bold mb-2">Search Result</h3>
          {searchResult.course ? (
            <>
              {/* Show course number and ID */}
              <div className="mb-2 text-sm text-gray-500 font-semibold">
                Course #
                {courses.findIndex((c) => c._id === searchResult.course._id) + 1}
                &nbsp;|&nbsp; ID: {searchResult.course._id}
              </div>
              {/* Show course picture if available */}
              {searchResult.course.picture && (
                <img
                  src={getImageSrc(searchResult.course.picture)}
                  alt={searchResult.course.title}
                  className="w-40 h-28 object-cover rounded mb-4"
                />
              )}
              <h3 className="text-xl font-semibold mb-2">
                {searchResult.course.title}
              </h3>
              <p className="mb-2 text-slate-600">
                {searchResult.course.description}
              </p>
              <h4 className="font-bold mb-2">Enrolled Students:</h4>
              {searchResult.students.length > 0 ? (
                <ul className="list-disc pl-6">
                  {searchResult.students.map((enroll) => (
                    <li key={enroll.student._id}>
                      {enroll.student.name} ({enroll.student.email})
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-slate-500">No students enrolled yet.</p>
              )}
              <p className="mt-2 font-semibold">
                Total Enrolled: {searchResult.students.length}
              </p>
              {/* Delete Course Button */}
              <button
                className="mt-4 bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
                onClick={async () => {
                  if (
                    window.confirm(
                      "Are you sure you want to delete this course? This action cannot be undone."
                    )
                  ) {
                    try {
                      const token = localStorage.getItem("token");
                      const res = await fetch(
                        `http://localhost:5000/api/teacher/courses/${searchResult.course._id}`,
                        {
                          method: "DELETE",
                          headers: {
                            Authorization: `Bearer ${token}`,
                          },
                        }
                      );
                      const data = await res.json();
                      if (res.ok) {
                        alert("Course deleted successfully!");
                        // Remove from courses and search result
                        setCourses((prev) =>
                          prev.filter((c) => c._id !== searchResult.course._id)
                        );
                        setSearchResult(null);
                      } else {
                        alert(data.message || "Failed to delete course.");
                      }
                    } catch (err) {
                      alert("Error deleting course.");
                    }
                  }
                }}
              >
                Delete Course
              </button>
            </>
          ) : (
            <p className="text-red-500">Course not found.</p>
          )}
        </div>
      )}
      {/* All Courses List */}
      <h3 className="text-xl font-bold mb-4 mt-8">All Courses Created By You</h3>
      {courses.length === 0 && <p>No courses found.</p>}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-6">
        {courses.map((course, idx) => (
          <div
            key={course._id}
            className="border rounded-xl bg-white shadow hover:shadow-lg transition transform duration-300 hover:scale-105 hover:shadow-2xl flex flex-col overflow-hidden max-w-md"
            style={{ minHeight: 340 }}
          >
            {/* Course Image */}
            {course.picture && (
              <img
                src={course.picture ? `http://localhost:5000/${course.picture}` : "/default.jpg"}
                alt={course.title}
                className="w-full h-40 object-cover"
              />
            )}
            <div className="flex-1 flex flex-col p-4">
              {/* Course Title and Info */}
              <div className="flex items-center justify-between mb-1">
                <span className="text-xs text-gray-500 font-semibold">
                  Course #{idx + 1} | ID: {course._id.slice(-6)}
                </span>
              </div>
              <h3 className="text-lg font-bold mb-1">{course.title}</h3>
              <p className="text-slate-600 text-sm mb-2 line-clamp-2">{course.description}</p>
              {/* Category and Price */}
              <div className="flex items-center justify-between mb-2">
                <span className="bg-gray-100 text-gray-700 text-xs px-3 py-1 rounded-full capitalize">
                  {course.category || "General"}
                </span>
                <span className="text-blue-700 font-semibold text-base">
                  ${course.price?.toFixed ? Number(course.price).toFixed(2) : course.price || "0.00"}
                </span>
              </div>
              {/* Enrolled Students */}
              <div className="mt-auto">
                <h4 className="font-bold text-sm mb-1">Enrolled Students:</h4>
                {enrollments[course._id] && enrollments[course._id].length > 0 ? (
                  <ul className="list-disc pl-4 text-xs">
                    {enrollments[course._id].slice(0, 2).map((enroll) => (
                      <li key={enroll.student._id}>
                        {enroll.student.name} ({enroll.student.email})
                      </li>
                    ))}
                    {enrollments[course._id].length > 2 && (
                      <li>and {enrollments[course._id].length - 2} more...</li>
                    )}
                  </ul>
                ) : (
                  <p className="text-slate-500 text-xs">No students enrolled yet.</p>
                )}
                <p className="mt-2 font-semibold text-xs">
                  Total Enrolled: {enrollments[course._id] ? enrollments[course._id].length : 0}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
