import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import TeacherGradeSubmissions from "./TeacherGradeSubmissions";

export default function QuizCard() {
  const [courses, setCourses] = useState([]);
  const [selectedCourse, setSelectedCourse] = useState("");
  const [title, setTitle] = useState("");
  const [questions, setQuestions] = useState([{ questionText: "", options: ["", "", "", ""], correctAnswer: "" }]);
  const [quizzes, setQuizzes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showAssignmentPage, setShowAssignmentPage] = useState(false);
  const navigate = useNavigate();

  // Fetch teacher's courses
  useEffect(() => {
    const fetchCourses = async () => {
      const token = localStorage.getItem("token");
      const res = await fetch("http://localhost:5000/api/teacher/my-courses", {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      setCourses(data);
    };
    fetchCourses();
  }, []);

  // Fetch quizzes for selected course
  useEffect(() => {
    if (!selectedCourse) return;
    const fetchQuizzes = async () => {
      setLoading(true);
      setError("");
      try {
        const token = localStorage.getItem("token");
        const res = await fetch(`http://localhost:5000/api/teacher/quizzes/course/${selectedCourse}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json();
        if (res.ok) {
          setQuizzes(Array.isArray(data) ? data : []);
        } else {
          setError(data.message || "Failed to fetch quizzes.");
        }
      } catch (err) {
        setError("Error fetching quizzes.");
      }
      setLoading(false);
    };
    fetchQuizzes();
  }, [selectedCourse]);

  // Handle quiz creation
  const handleQuizSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("token");
    try {
      const res = await fetch(`http://localhost:5000/api/teacher/courses/${selectedCourse}/quizzes`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ title, questions }),
      });
      const data = await res.json();
      if (res.ok) {
        toast.success(data.message || "Quiz created!");
        setTitle("");
        setQuestions([{ questionText: "", options: ["", "", "", ""], correctAnswer: "" }]);
        setQuizzes((prev) => [...prev, data.quiz]);
      } else {
        toast.error(data.message || "Failed to create quiz.");
      }
    } catch (err) {
      toast.error("Error creating quiz.");
    }
  };

  // Add/remove question logic
  const handleQuestionChange = (idx, field, value) => {
    setQuestions((prev) =>
      prev.map((q, i) =>
        i === idx ? { ...q, [field]: value } : q
      )
    );
  };
  const handleOptionChange = (qIdx, oIdx, value) => {
    setQuestions((prev) =>
      prev.map((q, i) =>
        i === qIdx
          ? { ...q, options: q.options.map((opt, oi) => (oi === oIdx ? value : opt)) }
          : q
      )
    );
  };
  const addQuestion = () => setQuestions([...questions, { questionText: "", options: ["", "", "", ""], correctAnswer: "" }]);
  const removeQuestion = (idx) => setQuestions(questions.filter((_, i) => i !== idx));

  return (
    <div className="max-w-5xl mx-auto mt-8 p-6 bg-white rounded shadow-lg">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6 gap-4">
        <h2 className="text-2xl font-bold">Teacher Dashboard</h2>
        <div className="flex gap-2">
          <button
            className={`px-4 py-2 rounded font-semibold transition ${!showAssignmentPage ? "bg-blue-600 text-white" : "bg-gray-200 text-gray-700"}`}
            onClick={() => setShowAssignmentPage(false)}
          >
            Quizzes
          </button>
          <button
            className={`px-4 py-2 rounded font-semibold transition ${showAssignmentPage ? "bg-blue-600 text-white" : "bg-gray-200 text-gray-700"}`}
            onClick={() => setShowAssignmentPage(true)}
            disabled={!selectedCourse}
          >
            Assignments
          </button>
        </div>
      </div>
      <div className="mb-6">
        <label className="block mb-1 font-semibold">Select Course</label>
        <select
          className="border px-3 py-2 rounded w-full max-w-xs"
          value={selectedCourse}
          onChange={(e) => {
            setSelectedCourse(e.target.value);
          }}
          required
        >
          <option value="">-- Select a course --</option>
          {courses.map((c) => (
            <option key={c._id} value={c._id}>{c.title}</option>
          ))}
        </select>
      </div>
      {showAssignmentPage ? (
        selectedCourse && (
          <TeacherGradeSubmissions courseId={selectedCourse} />
        )
      ) : (
        <>
          <h2 className="text-2xl font-bold mb-6">Create Quiz</h2>
          <form onSubmit={handleQuizSubmit} className="mb-8">
            <div className="mb-4">
              <label className="block mb-1 font-semibold">Quiz Title</label>
              <input
                type="text"
                className="border px-3 py-2 rounded w-full"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
                placeholder="Enter quiz title"
              />
            </div>
            {questions.map((q, idx) => (
              <div key={idx} className="mb-4 border p-3 rounded">
                <label className="block mb-1 font-semibold">Question {idx + 1}</label>
                <input
                  type="text"
                  className="border px-3 py-2 rounded w-full mb-2"
                  value={q.questionText}
                  onChange={(e) => handleQuestionChange(idx, "questionText", e.target.value)}
                  required
                  placeholder="Enter question"
                />
                <div className="grid grid-cols-2 gap-2 mb-2">
                  {q.options.map((opt, oIdx) => (
                    <input
                      key={oIdx}
                      type="text"
                      className="border px-2 py-1 rounded"
                      value={opt}
                      onChange={(e) => handleOptionChange(idx, oIdx, e.target.value)}
                      required
                      placeholder={`Option ${oIdx + 1}`}
                    />
                  ))}
                </div>
                <input
                  type="text"
                  className="border px-3 py-2 rounded w-full mb-2"
                  value={q.correctAnswer}
                  onChange={(e) => handleQuestionChange(idx, "correctAnswer", e.target.value)}
                  required
                  placeholder="Correct answer"
                />
                {questions.length > 1 && (
                  <button type="button" className="text-red-600" onClick={() => removeQuestion(idx)}>
                    Remove Question
                  </button>
                )}
              </div>
            ))}
            <button type="button" className="bg-blue-500 text-white px-3 py-1 rounded mr-2" onClick={addQuestion}>
              Add Question
            </button>
            <button type="submit" className="bg-green-600 text-white px-4 py-2 rounded">
              Create Quiz
            </button>
          </form>
          <h2 className="text-2xl font-bold mb-6 flex items-center justify-between">
            Quizzes for Selected Course
          </h2>
          {loading && <p>Loading quizzes...</p>}
          {error && <p className="text-red-600">{error}</p>}
          {!loading && quizzes.length === 0 && <p>No quizzes found.</p>}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {quizzes.map((quiz) => (
              <div
                key={quiz._id}
                className="rounded-xl bg-white border shadow hover:shadow-lg transition flex flex-col overflow-hidden"
                style={{ minHeight: 220 }}
              >
                <div className="flex-1 flex flex-col p-4">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs text-gray-500 font-semibold">
                      Quiz ID: {quiz._id.slice(-6)}
                    </span>
                    <span className="text-xs px-2 py-1 rounded bg-blue-100 text-blue-700 font-semibold capitalize">
                      {quiz.title}
                    </span>
                  </div>
                  <div className="text-xs text-gray-400 mb-2">
                    Created: {quiz.createdAt ? new Date(quiz.createdAt).toLocaleDateString() : "N/A"}
                  </div>
                  <div className="mt-2">
                    <h4 className="font-bold text-sm mb-1">
                      Questions: {quiz.questions?.length || 0}
                    </h4>
                    <ul className="list-disc pl-4 text-xs">
                      {quiz.questions?.map((q, i) => (
                        <li key={i}>
                          <span className="font-semibold">{q.questionText}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
