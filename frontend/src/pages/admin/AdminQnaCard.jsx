import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";

export default function QnA() {
  const [courses, setCourses] = useState([]);
  const [questions, setQuestions] = useState([]);
  const [selectedCourse, setSelectedCourse] = useState("");
  const [questionText, setQuestionText] = useState("");
  const [answerInputs, setAnswerInputs] = useState({});

  const token = localStorage.getItem("token");
  const user = JSON.parse(localStorage.getItem("user")); // includes role, id, etc.

  const isStudent = user?.role === "student";
  const isTeacher = user?.role === "teacher";

  // Fetch courses depending on role
  useEffect(() => {
    const fetchCourses = async () => {
      try {
        // Only fetch courses for students and teachers, not admin
        if (user?.role === "admin") return;
        const url = isStudent
          ? "http://localhost:5000/api/student/enrolled-courses"
          : "http://localhost:5000/api/teacher/my-courses";
        const res = await fetch(url, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json();
        setCourses(data);
      } catch (err) {
        toast.error("Failed to load courses");
      }
    };
    fetchCourses();
  }, [isStudent, token, user]);

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

  // Delete a question (admin)
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
      <h2 className="text-2xl font-bold mb-4">Q&amp;A Section</h2>

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
              <option key={course._id} value={course._id}>
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
            {questions.map((q) => (
              <li key={q._id} className="border-b pb-4">
                <p className="font-medium">{q.text}</p>
                <p className="text-sm text-gray-500">Course: {q.course?.title || "N/A"}</p>
                <div className="text-xs text-gray-600 mb-1">
                  Asked by: {q.askedBy?.name} ({q.askedBy?.email}) | ID: {q.askedBy?._id}
                </div>
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

                {/* Admin Answer Box and Delete Button */}
                {(isTeacher || user?.role === "admin") && (
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
                    <div className="flex gap-2 mt-1">
                      <button
                        onClick={() => handleAnswer(q._id)}
                        className="bg-green-600 text-white text-sm px-3 py-1 rounded"
                      >
                        Submit Answer
                      </button>
                      <button
                        onClick={() => handleDeleteQuestion(q._id)}
                        className="bg-red-600 text-white text-sm px-3 py-1 rounded"
                      >
                        Delete Question
                      </button>
                    </div>
                  </div>
                )}
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
