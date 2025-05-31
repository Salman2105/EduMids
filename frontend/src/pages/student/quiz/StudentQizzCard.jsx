import React, { useEffect, useState } from "react";

const API = "http://localhost:5000/api/quiz/student/dashboard";
const QUIZ_API = "http://localhost:5000/api/quiz";

const QuizList = ({ quizCards, startQuiz, submitting }) => (
  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
    {quizCards.filter(q => !q.completed).map((quiz) => (
      <div key={quiz.quizId} className="bg-white rounded shadow p-4 flex flex-col">
        <div className="font-semibold">{quiz.title}</div>
        <div className="text-sm text-gray-500">Course: {quiz.courseTitle}</div>
        <div className="text-xs text-gray-400">Created: {new Date(quiz.createdAt).toLocaleString()}</div>
        <button
          className="mt-2 px-3 py-1 bg-blue-500 text-white rounded"
          onClick={() => startQuiz(quiz.quizId)}
          disabled={submitting}
        >
          Start / Continue
        </button>
      </div>
    ))}
  </div>
);

const QuizResults = ({ quizCards }) => {
  const completed = quizCards.filter(q => q.completed);

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">Quiz Results</h2>
      {completed.length === 0 ? (
        <div className="text-gray-500">No quiz results yet.</div>
      ) : (
        <div className="space-y-4">
          {completed.map(res => (
            <div key={res.quizId} className="bg-white rounded shadow p-4 flex flex-col md:flex-row md:items-center md:justify-between">
              <div>
                <div className="font-semibold">{res.title}</div>
                <div className="text-sm text-gray-500">Submitted: {res.submittedAt ? new Date(res.submittedAt).toLocaleString() : "N/A"}</div>
              </div>
              <div className="font-bold text-blue-700 text-lg">Score: {res.score}</div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

const QuizForm = ({ quizData, answers, handleAnswer, saveProgress, submitQuiz, submitting }) => (
  <div className="bg-white rounded shadow p-6 mb-8">
    <h3 className="text-xl font-bold mb-2">{quizData.title}</h3>
    <form
      onSubmit={e => {
        e.preventDefault();
        submitQuiz();
      }}
    >
      {quizData.questions.map((q, idx) => (
        <div key={q._id} className="mb-4">
          <div className="font-semibold">{idx + 1}. {q.questionText}</div>
          <div className="flex flex-col gap-2 mt-1">
            {q.options.map((opt, oidx) => (
              <label key={oidx} className="flex items-center gap-2">
                <input
                  type="radio"
                  name={`q${idx}`}
                  value={opt}
                  checked={answers[idx]?.selectedOption === opt}
                  onChange={() => handleAnswer(idx, opt)}
                  required
                />
                {opt}
              </label>
            ))}
          </div>
        </div>
      ))}
      <div className="flex gap-2">
        <button type="button" className="px-3 py-1 bg-gray-300 rounded" onClick={saveProgress} disabled={submitting}>
          Save Progress
        </button>
        <button type="submit" className="px-3 py-1 bg-green-500 text-white rounded" disabled={submitting}>
          Submit Quiz
        </button>
      </div>
    </form>
  </div>
);

const StudentQuizzCard = () => {
  const [quizCards, setQuizCards] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [activeQuiz, setActiveQuiz] = useState(null);
  const [quizData, setQuizData] = useState(null);
  const [answers, setAnswers] = useState([]);
  const [submitting, setSubmitting] = useState(false);
  const token = localStorage.getItem("token");

  useEffect(() => {
    const fetchDashboard = async () => {
      setLoading(true);
      try {
        const res = await fetch(API, { headers: { Authorization: `Bearer ${token}` } });
        const data = await res.json();
        setQuizCards(data.quizCards || []);
      } catch (err) {
        setError("Failed to load quizzes.");
      } finally {
        setLoading(false);
      }
    };
    fetchDashboard();
  }, [token]);

  const startQuiz = async (quizId) => {
    setActiveQuiz(quizId);
    setQuizData(null);
    setAnswers([]);
    setSubmitting(false);
    setError(null);
    try {
      const res = await fetch(`${QUIZ_API}/course/${quizCards.find(q => q.quizId === quizId).courseId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const quizzes = await res.json();
      const quiz = quizzes.find(q => q._id === quizId);
      if (!quiz) throw new Error("Quiz not found");
      setQuizData(quiz);

      const progressRes = await fetch(`${QUIZ_API}/progress/${quizId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const progressData = await progressRes.json();
      if (progressData.progress?.answers?.length) {
        setAnswers(progressData.progress.answers);
      } else {
        setAnswers(Array(quiz.questions.length).fill({ selectedOption: "" }));
      }
    } catch (err) {
      setError("Failed to load quiz.");
      setActiveQuiz(null);
    }
  };

  const handleAnswer = (idx, opt) => {
    setAnswers(prev => {
      const updated = [...prev];
      updated[idx] = { selectedOption: opt };
      return updated;
    });
  };

  const saveProgress = async () => {
    if (!activeQuiz) return;
    setSubmitting(true);
    setError(null);
    try {
      await fetch(`${QUIZ_API}/save-progress/${activeQuiz}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ answers })
      });
    } catch (err) {
      setError("Failed to save progress.");
    } finally {
      setSubmitting(false);
    }
  };

  const submitQuiz = async () => {
    if (!activeQuiz) return;
    setSubmitting(true);
    setError(null);
    try {
      const res = await fetch(`${QUIZ_API}/submit-quiz/${activeQuiz}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ answers })
      });
      if (!res.ok) throw new Error("Submission failed");
      setActiveQuiz(null);
      setQuizData(null);
      setAnswers([]);
      const dashRes = await fetch(API, { headers: { Authorization: `Bearer ${token}` } });
      const dashData = await dashRes.json();
      setQuizCards(dashData.quizCards || []);
    } catch (err) {
      setError("Failed to submit quiz.");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div className="text-red-500">{error}</div>;

  return (
    <div className="max-w-4xl mx-auto p-4">
      <h2 className="text-2xl font-bold mb-4">Available Quizzes</h2>
      <QuizList quizCards={quizCards} startQuiz={startQuiz} submitting={submitting} />
      {activeQuiz && quizData && (
        <QuizForm
          quizData={quizData}
          answers={answers}
          handleAnswer={handleAnswer}
          saveProgress={saveProgress}
          submitQuiz={submitQuiz}
          submitting={submitting}
        />
      )}
      <QuizResults quizCards={quizCards} />
    </div>
  );
};

export default StudentQuizzCard;
