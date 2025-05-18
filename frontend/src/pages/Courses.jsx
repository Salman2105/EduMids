import React, { useEffect, useState } from "react";
import axios from "axios";

const Courses = () => {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Adjust the URL if your backend runs on a different port or domain
    axios.get("http://localhost:5000/api/courses")
      .then(res => {
        setCourses(res.data);
        setLoading(false);
      })
      .catch(err => {
        setLoading(false);
        alert("Failed to fetch courses");
      });
  }, []);

  if (loading) return <div>Loading courses...</div>;

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Courses</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {courses.map(course => (
          <div key={course._id} className="bg-white rounded shadow p-4">
            <h2 className="text-xl font-semibold">{course.title}</h2>
            <p className="text-gray-600 mb-2">{course.description}</p>
            <div className="text-sm text-gray-500">
              Created by: {course.createdBy?.name || "Unknown"}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Courses;