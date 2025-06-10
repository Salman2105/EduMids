import React, { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";

const TeacherGradeSubmissions = ({ assignmentId, courseId, onBack }) => {
  const [submissions, setSubmissions] = useState([]);
  const [inputs, setInputs] = useState({}); // { [submissionId]: { marks: '', feedback: '' } }
  const [loading, setLoading] = useState(false);
  const [showAssignmentForm, setShowAssignmentForm] = useState(false);
  const [newAssignment, setNewAssignment] = useState({
    title: "",
    description: "",
    deadline: "",
    totalMarks: 100,
    attachmentUrl: "",
  });
  const [message, setMessage] = useState("");
  const [myAssignments, setMyAssignments] = useState([]);

  // Helper to get token from localStorage (adjust if you store it elsewhere)
  const getToken = () => localStorage.getItem("token");

  useEffect(() => {
    if (!assignmentId) return;
    const fetchSubmissions = async () => {
      setLoading(true);
      try {
        const { data } = await axios.get(
          `http://localhost:5000/api/submissions/assignment/${assignmentId}`,
          {
            headers: {
              Authorization: `Bearer ${getToken()}`,
            },
          }
        );
        setSubmissions(Array.isArray(data.submissions) ? data.submissions : []);
      } catch (err) {
        setSubmissions([]); // Ensure it's always an array
        alert("Failed to fetch submissions");
      }
      setLoading(false);
    };
    fetchSubmissions();
  }, [assignmentId]);

  // Fetch all assignments created by this teacher
  useEffect(() => {
    const fetchMyAssignments = async () => {
      try {
        const token = getToken();
        const { data } = await axios.get(
          "http://localhost:5000/api/assignments/my",
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setMyAssignments(Array.isArray(data.assignments) ? data.assignments : []);
      } catch (err) {
        setMyAssignments([]);
      }
    };
    fetchMyAssignments();
  }, []);

  const handleInputChange = (id, field, value) => {
    setInputs((prev) => ({
      ...prev,
      [id]: { ...prev[id], [field]: value },
    }));
  };

  const handleGrade = async (id) => {
    const { marks, feedback } = inputs[id] || {};
    try {
      await axios.put(
        `http://localhost:5000/api/submissions/${id}/grade`,
        { marksObtained: marks, feedback },
        {
          headers: {
            Authorization: `Bearer ${getToken()}`,
          },
        }
      );
      alert("Graded!");
    } catch (err) {
      alert("Failed to grade submission");
    }
  };

  // Assignment upload logic
  const handleAssignmentInput = (field, value) => {
    setNewAssignment((prev) => ({ ...prev, [field]: value }));
  };

  const handleAssignmentSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    try {
      const token = getToken();
      // Ensure deadline is in ISO format (YYYY-MM-DDTHH:MM)
      const formattedDeadline = newAssignment.deadline
        ? new Date(newAssignment.deadline).toISOString()
        : "";
      const payload = {
        ...newAssignment,
        deadline: formattedDeadline,
        course: courseId, // Make sure courseId is valid and not empty
      };
      // Debug log
      console.log("Assignment payload:", payload);
      const { data } = await axios.post(
        "http://localhost:5000/api/assignments/create",
        payload,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      toast.success("Assignment created successfully!");
      setShowAssignmentForm(false);
      setNewAssignment({ title: "", description: "", deadline: "", totalMarks: 100, attachmentUrl: "" });
    } catch (err) {
      setMessage("Failed to create assignment");
      // Debug log
      if (err.response) {
        console.error("Assignment creation error:", err.response.data);
      } else {
        console.error("Assignment creation error:", err);
      }
    }
  };

  return (
    <div className="p-4 max-w-3xl mx-auto bg-white rounded shadow">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-2xl font-semibold">Student Submissions</h2>
        {onBack && (
          <button onClick={onBack} className="px-3 py-1 rounded bg-gray-200 hover:bg-gray-300">Back</button>
        )}
      </div>
      {/* List all assignments created by this teacher */}
      <div className="mb-4">
        <h3 className="text-lg font-bold mb-2">Your Assignments</h3>
        {myAssignments.length === 0 ? (
          <div className="text-gray-500">No assignments created yet.</div>
        ) : (
          <ul className="divide-y">
            {myAssignments.map(a => (
              <li key={a._id} className="py-2 flex flex-col">
                <span className="font-semibold">{a.title}</span>
                <span className="text-sm text-gray-600">
                  Course: {a.course?.title || "N/A"} | Deadline: {a.deadline ? new Date(a.deadline).toLocaleString() : "N/A"}
                </span>
              </li>
            ))}
          </ul>
        )}
      </div>
      <button
        className="mb-4 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        onClick={() => setShowAssignmentForm((v) => !v)}
      >
        {showAssignmentForm ? "Cancel" : "Upload New Assignment"}
      </button>
      {showAssignmentForm && (
        <form onSubmit={handleAssignmentSubmit} className="mb-6 bg-gray-50 p-4 rounded">
          <h3 className="text-lg font-bold mb-2">New Assignment</h3>
          <input
            type="text"
            className="border px-3 py-2 rounded w-full mb-2"
            placeholder="Title"
            value={newAssignment.title}
            onChange={e => handleAssignmentInput("title", e.target.value)}
            required
          />
          <textarea
            className="border px-3 py-2 rounded w-full mb-2"
            placeholder="Description"
            value={newAssignment.description}
            onChange={e => handleAssignmentInput("description", e.target.value)}
          />
          <input
            type="datetime-local"
            className="border px-3 py-2 rounded w-full mb-2"
            value={newAssignment.deadline}
            onChange={e => handleAssignmentInput("deadline", e.target.value)}
            required
          />
          <input
            type="number"
            className="border px-3 py-2 rounded w-full mb-2"
            placeholder="Total Marks"
            value={newAssignment.totalMarks}
            onChange={e => handleAssignmentInput("totalMarks", e.target.value)}
            required
          />
          <input
            type="text"
            className="border px-3 py-2 rounded w-full mb-2"
            placeholder="Attachment URL (optional)"
            value={newAssignment.attachmentUrl}
            onChange={e => handleAssignmentInput("attachmentUrl", e.target.value)}
          />
          <button type="submit" className="bg-green-600 text-white px-4 py-2 rounded">Create Assignment</button>
          {/* Remove message display for success, keep for error */}
          {message && <p className="mt-2 text-green-600">{message}</p>}
        </form>
      )}
      {loading ? (
        <div>Loading...</div>
      ) : (
        submissions && submissions.length > 0 ? (
          submissions.map((s) => (
            <div key={s._id} className="border-b py-4">
              <p>
                <strong>Student:</strong> {s.student.name} ({s.student.email})
              </p>
              <a
                href={s.submittedFileUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-500 underline"
              >
                View Submission
              </a>
              <div className="mt-2 flex gap-2">
                <input
                  type="number"
                  placeholder="Marks"
                  value={inputs[s._id]?.marks || ""}
                  onChange={e => handleInputChange(s._id, "marks", e.target.value)}
                  className="border px-2 py-1 w-20"
                />
                <input
                  type="text"
                  placeholder="Feedback"
                  value={inputs[s._id]?.feedback || ""}
                  onChange={e => handleInputChange(s._id, "feedback", e.target.value)}
                  className="border px-2 py-1 flex-1"
                />
                <button
                  onClick={() => handleGrade(s._id)}
                  className="bg-green-600 text-white px-3 py-1 rounded"
                >
                  Grade
                </button>
              </div>
            </div>
          ))
        ) : (
          <div>No submissions found.</div>
        )
      )}
    </div>
  );
};

export default TeacherGradeSubmissions;
