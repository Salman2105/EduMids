import React from "react";

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

export default QuizForm;
