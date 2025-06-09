import React, { useState, useEffect } from "react";
import axios from "axios";

const StudentAssignmentSubmit = ({ assignmentId }) => {
  const [assignment, setAssignment] = useState(null);
  const [file, setFile] = useState(null);
  const [alreadySubmitted, setAlreadySubmitted] = useState(false);
  const [message, setMessage] = useState("");

  const token = localStorage.getItem("token");

  useEffect(() => {
    if (!assignmentId) return;
    const fetchAssignment = async () => {
      try {
        const { data } = await axios.get(
          `http://localhost:5000/api/assignments/${assignmentId}`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setAssignment(data.assignment);
      } catch (err) {
        setMessage("Failed to load assignment. Please login again.");
        setAssignment(null);
      }
    };

    const checkSubmission = async () => {
      try {
        const { data } = await axios.get(
          `http://localhost:5000/api/submissions/student`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        if (data && Array.isArray(data.submissions)) {
          const submitted = data.submissions.find(
            (s) => s.assignment && s.assignment._id === assignmentId
          );
          if (submitted) {
            setAlreadySubmitted(true);
            setMessage("You have already submitted this assignment.");
          }
        } else {
          console.warn("No submissions array in response", data);
        }
      } catch (err) {
        setMessage("Failed to check submission. Please login again.");
        setAlreadySubmitted(false);
      }
    };

    fetchAssignment();
    checkSubmission();
  }, [assignmentId, token]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!file) return alert("Please upload a file.");
    if (!token) return alert("You must be logged in to submit.");

    // upload file to Cloudinary
    const formData = new FormData();
    formData.append("file", file);
    formData.append(
      "upload_preset",
      import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET || "your_upload_preset"
    );
    const cloudName = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME || "your_cloud_name";
    const cloudRes = await axios.post(
      `https://api.cloudinary.com/v1_1/${cloudName}/auto/upload`,
      formData
    );
    const fileUrl = cloudRes.data.secure_url;

    // submit to backend
    await axios.post(
      "http://localhost:5000/api/submissions",
      {
        assignment: assignmentId,
        submittedFileUrl: fileUrl,
      },
      { headers: { Authorization: `Bearer ${token}` } }
    );

    setAlreadySubmitted(true);
    setMessage("Assignment submitted successfully!");
  };

  if (!assignmentId) return <p>Invalid assignment. Please try again.</p>;
  if (!assignment) return <p>Loading assignment...</p>;

  return (
    <div className="p-4 border rounded-lg shadow-md max-w-xl mx-auto bg-white">
      <h2 className="text-xl font-bold mb-2">{assignment.title}</h2>
      <p className="mb-2">{assignment.description}</p>
      <p className="mb-4 text-sm text-gray-600">
        Deadline: {new Date(assignment.deadline).toLocaleString()}
      </p>

      {alreadySubmitted ? (
        <p className="text-green-600 font-semibold">{message}</p>
      ) : (
        <form onSubmit={handleSubmit}>
          <input
            type="file"
            onChange={(e) => setFile(e.target.files[0])}
            className="mb-4"
          />
          <button
            type="submit"
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          >
            Submit Assignment
          </button>
        </form>
      )}
      {message && !alreadySubmitted && (
        <p className="text-red-600 font-semibold mt-2">{message}</p>
      )}
    </div>
  );
};

export default StudentAssignmentSubmit;
