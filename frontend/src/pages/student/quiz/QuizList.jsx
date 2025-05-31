import React from "react";

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

export default QuizList;
