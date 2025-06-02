import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";

export default function QnA() {
  const [courses, setCourses] = useState([]);
  const [questions, setQuestions] = useState([]);
  const [selectedCourse, setSelectedCourse] = useState("");
  const [questionText, setQuestionText] = useState("");
  const [answerInputs, setAnswerInputs] = useState({});
  const [editingQuestionId, setEditingQuestionId] = useState(null);
  const [editQuestionText, setEditQuestionText] = useState("");

  const token = localStorage.getItem("token");
  const user = JSON.parse(localStorage.getItem("user")); // includes role, id, etc.

  const isStudent = user?.role === "student";
  const isTeacher = user?.role === "teacher";

  // Fetch courses depending on role
  useEffect(() => {
    const fetchCourses = async () => {
      try {
        // Use the same endpoint as StudentCourseCard.jsx for student
        const url = isStudent
          ? "http://localhost:5000/api/student/courses"
          : "http://localhost:5000/api/teacher/my-courses";
        const res = await fetch(url, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!res.ok) throw new Error("Failed to fetch courses");
        const data = await res.json();
        // For students, data.courses is the array
        if (isStudent) {
          setCourses(Array.isArray(data.courses) ? data.courses : []);
        } else {
          setCourses(Array.isArray(data) ? data : []);
        }
      } catch (err) {
        toast.error("Failed to load courses");
      }
    };
    fetchCourses();
  }, [isStudent, token]);

  // Fetch Q&A data
  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        const res = await fetch("http://localhost:5000/api/qna/all", {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json();
        setQuestions(data.filter((q) => !q.deleted));
      } catch (err) {
        toast.error("Failed to load questions");
      }
    };
    fetchQuestions();
  }, [token]);

  // Submit a question
  const handleAskQuestion = async (e) => {
    e.preventDefault();
    if (!selectedCourse || !questionText.trim()) {
      return toast.error("Course and question are required.");
    }

    try {
      const res = await fetch("http://localhost:5000/api/qna/ask", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ courseId: selectedCourse, text: questionText }),
      });

      const data = await res.json();
      if (res.ok) {
        toast.success("Question submitted!");
        setQuestionText("");
        setQuestions((prev) => [data.question, ...prev]);
      } else {
        toast.error(data.message);
      }
    } catch (err) {
      toast.error("Error posting question.");
    }
  };

  // Submit an answer
  const handleAnswer = async (questionId) => {
    const answerText = answerInputs[questionId];
    if (!answerText || !answerText.trim()) return toast.error("Answer cannot be empty.");

    try {
      const res = await fetch(`http://localhost:5000/api/qna/answer/${questionId}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ text: answerText }),
      });

      const data = await res.json();
      if (res.ok) {
        toast.success("Answered!");
        setQuestions((prev) =>
          prev.map((q) => (q._id === questionId ? data.question : q))
        );
        setAnswerInputs((prev) => ({ ...prev, [questionId]: "" }));
      } else {
        toast.error(data.message);
      }
    } catch (err) {
      toast.error("Error submitting answer.");
    }
  };

  // Edit a question (student)
  const handleEditQuestion = (q) => {
    setEditingQuestionId(q._id);
    setEditQuestionText(q.text);
  };

  const handleSaveEdit = async (questionId) => {
    if (!editQuestionText.trim()) return toast.error("Question cannot be empty.");
    try {
      const res = await fetch(`http://localhost:5000/api/qna/edit/${questionId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ text: editQuestionText }),
      });
      const data = await res.json();
      if (res.ok) {
        toast.success("Question updated!");
        setQuestions((prev) =>
          prev.map((q) => (q._id === questionId ? data.question : q))
        );
        setEditingQuestionId(null);
        setEditQuestionText("");
      } else {
        toast.error(data.message);
      }
    } catch (err) {
      toast.error("Error updating question.");
    }
  };

  // Delete a question (student)
  const handleDeleteQuestion = async (questionId) => {
    if (!window.confirm("Are you sure you want to delete this question?")) return;
    try {
      const res = await fetch(`http://localhost:5000/api/qna/${questionId}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (res.ok) {
        toast.success("Question deleted!");
        setQuestions((prev) => prev.filter((q) => q._id !== questionId));
      } else {
        toast.error(data.message);
      }
    } catch (err) {
      toast.error("Error deleting question.");
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h2 className="text-2xl font-bold mb-4">Q&A Section</h2>

      {/* Student Question Form */}
      {isStudent && (
        <form onSubmit={handleAskQuestion} className="mb-6 bg-white rounded shadow p-4">
          <h3 className="text-lg font-semibold mb-2">Ask a Question</h3>
          <select
            className="w-full border p-2 mb-2 rounded"
            value={selectedCourse}
            onChange={(e) => setSelectedCourse(e.target.value)}
          >
            <option value="">Select a Course</option>
            {courses.map((course) => (
              <option key={course.courseId || course._id} value={course.courseId || course._id}>
                {course.title}
              </option>
            ))}
          </select>
          <textarea
            className="w-full border p-2 mb-2 rounded"
            placeholder="Type your question here..."
            value={questionText}
            onChange={(e) => setQuestionText(e.target.value)}
            required
          />
          <button
            type="submit"
            className="bg-blue-600 text-white px-4 py-2 rounded"
          >
            Submit Question
          </button>
        </form>
      )}

      {/* Question List */}
      <div className="bg-white rounded shadow p-4">
        <h3 className="text-lg font-semibold mb-4">All Questions</h3>
        {questions.length === 0 ? (
          <p>No questions found.</p>
        ) : (
          <ul className="space-y-4">
            {questions.map((q) => {
              const isOwnQuestion = isStudent && q.askedBy?._id === user?._id;
              return (
                <li key={q._id} className="border-b pb-4">
                  {/* Edit mode */}
                  {editingQuestionId === q._id ? (
                    <div>
                      <textarea
                        className="w-full border p-2 mb-2 rounded"
                        value={editQuestionText}
                        onChange={e => setEditQuestionText(e.target.value)}
                      />
                      <div className="flex gap-2 mb-2">
                        <button
                          className="bg-green-600 text-white px-3 py-1 rounded"
                          onClick={() => handleSaveEdit(q._id)}
                        >
                          Save
                        </button>
                        <button
                          className="bg-gray-400 text-white px-3 py-1 rounded"
                          onClick={() => { setEditingQuestionId(null); setEditQuestionText(""); }}
                        >
                          Cancel
                        </button>
                      </div>
                    </div>
                  ) : (
                    <>
                      <p className="font-medium">{q.text}</p>
                      <p className="text-sm text-gray-500">Course: {q.course?.title || "N/A"}</p>
                      <div className="text-xs text-gray-600 mb-1">
                        Asked by: {q.askedBy?.name} ({q.askedBy?.email}) | ID: {q.askedBy?._id}
                      </div>
                      {/* Edit/Delete buttons for own questions */}
                      {isOwnQuestion && (
                        <div className="flex gap-2 mb-2">
                          <button
                            className="bg-yellow-500 text-white text-xs px-2 py-1 rounded"
                            onClick={() => handleEditQuestion(q)}
                          >
                            Edit
                          </button>
                          <button
                            className="bg-red-600 text-white text-xs px-2 py-1 rounded"
                            onClick={() => handleDeleteQuestion(q._id)}
                          >
                            Delete
                          </button>
                        </div>
                      )}
                    </>
                  )}
                  <div className="mt-2">
                    <h4 className="text-sm font-semibold">Answers:</h4>
                    {q.answers?.length > 0 ? (
                      <ul className="list-disc ml-5 text-sm text-gray-700">
                        {q.answers.map((a, i) => (
                          <li key={i}>
                            {a.text}
                            <div className="text-xs text-gray-600">
                              Answered by: {a.answeredBy?.name} ({a.answeredBy?.email}) | ID: {a.answeredBy?._id}
                            </div>
                          </li>
                        ))}
                      </ul>
                    ) : (
                      <p className="text-xs text-gray-400">No answers yet.</p>
                    )}
                  </div>
                  {/* Teacher Answer Box */}
                  {isTeacher && (
                    <div className="mt-2">
                      <textarea
                        className="w-full border p-2 text-sm rounded"
                        placeholder="Write your answer..."
                        value={answerInputs[q._id] || ""}
                        onChange={(e) =>
                          setAnswerInputs((prev) => ({
                            ...prev,
                            [q._id]: e.target.value,
                          }))
                        }
                      />
                      <button
                        onClick={() => handleAnswer(q._id)}
                        className="mt-1 bg-green-600 text-white text-sm px-3 py-1 rounded"
                      >
                        Submit Answer
                      </button>
                    </div>
                  )}
                </li>
              );
            })}
          </ul>
        )}
      </div>
    </div>
  );
}
