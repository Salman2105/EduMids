import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import BuyButton from "../../components/BuyButton";
import { useAuthStore } from "../../lib/auth";

function EnrollButton({ course }) {
  const navigate = useNavigate();

  const isFree = (course.category && course.category.toLowerCase() === 'free') || Number(course.price) === 0;

  const handleEnroll = async () => {
    if (isFree) {
      // Directly enroll the user (simulate API call)
      try {
        const token = localStorage.getItem("token");
        const res = await fetch(`http://localhost:5000/api/enrollments/${course._id}`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
          },
        });
        if (!res.ok) {
          let errMsg = "Enrollment failed";
          try {
            const errData = await res.json();
            errMsg = errData.message || JSON.stringify(errData) || errMsg;
          } catch (e) {
            // fallback if not JSON
          }
          throw new Error(errMsg);
        }
        // Optionally show a toast or redirect
        navigate("/student/courses");
      } catch (err) {
        alert(err.message || "Could not enroll in course");
      }
    } else {
      navigate(`/checkout/${course._id}`);
    }
  };

  return (
    <button
      className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
      onClick={handleEnroll}
    >
      {isFree ? "Enroll Free" : "Enroll Now"}
    </button>
  );
}

export default function StudentAllCoursesCard() {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchCourses = async () => {
      setLoading(true);
      setError("");
      try {
        const user = localStorage.getItem("user");
        console.log("User from localStorage:", user);
        const token = localStorage.getItem("token");
        console.log("token from localStorage:", token);
        const res = await fetch("http://localhost:5000/api/courses", {
          headers: token ? { Authorization: `Bearer ${token}` } : {},
        });
        if (!res.ok) throw new Error("Failed to fetch courses");
        const data = await res.json();
        setCourses(data);
      } catch (err) {
        setError(err.message || "Error fetching courses");
      } finally {
        setLoading(false);
      }
    };
    fetchCourses();
  }, []);

  if (loading) return <div className="p-4">Loading courses...</div>;
  if (error) return <div className="p-4 text-red-500">{error}</div>;
  if (!courses.length) return <div className="p-4">No courses available at the moment.</div>;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-6 items-stretch">
      {courses.map((course) => (
        <div
          key={course._id}
          className="border rounded-xl shadow bg-white flex flex-col max-w-xs w-full mx-auto h-full hover:shadow-lg transition-transform duration-300 hover:scale-105"
          style={{ minHeight: "420px", transitionProperty: "box-shadow, transform" }}
        >
          {course.picture && (
            <img
              src={`http://localhost:5000/${course.picture}`}
              alt={course.title}
              className="w-full h-44 object-cover rounded-t-xl"
            />
          )}
          <div className="p-5 flex flex-col flex-1">
            <div className="font-bold text-lg mb-1">{course.title}</div>
            <div className="text-gray-600 text-sm mb-2 line-clamp-2">{course.description}</div>
            <div className="flex items-center justify-between mb-2">
              <span className="bg-blue-100 text-blue-700 text-xs px-3 py-1 rounded-full capitalize">
                {course.category || "General"}
              </span>
              <span className="text-green-700 font-semibold text-lg">
                ${course.price?.toFixed ? course.price.toFixed(2) : course.price || "0.00"}
              </span>
            </div>
            <div className="mt-auto flex justify-end">
              <EnrollButton course={course} />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
