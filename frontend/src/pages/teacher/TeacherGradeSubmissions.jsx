import React, { useEffect, useState } from "react";
import axios from "axios";

const TeacherGradeSubmissions = ({ assignmentId }) => {
  const [submissions, setSubmissions] = useState([]);
  const [inputs, setInputs] = useState({}); // { [submissionId]: { marks: '', feedback: '' } }
  const [loading, setLoading] = useState(false);

  // Helper to get token from localStorage (adjust if you store it elsewhere)
  const getToken = () => localStorage.getItem("token");

  useEffect(() => {
    const fetchSubmissions = async () => {
      setLoading(true);
      try {
        const { data } = await axios.get(
          `/api/submissions/assignment/${assignmentId}`,
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
        `/api/submissions/${id}/grade`,
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

  return (
    <div className="p-4 max-w-3xl mx-auto bg-white rounded shadow">
      <h2 className="text-2xl font-semibold mb-4">Student Submissions</h2>
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
                  onChange={(e) =>
                    handleInputChange(s._id, "marks", e.target.value)
                  }
                  className="border px-2 py-1 w-20"
                />
                <input
                  type="text"
                  placeholder="Feedback"
                  value={inputs[s._id]?.feedback || ""}
                  onChange={(e) =>
                    handleInputChange(s._id, "feedback", e.target.value)
                  }
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
