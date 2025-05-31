import React from "react";

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

export default QuizResults;
