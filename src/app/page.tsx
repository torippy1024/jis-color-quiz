'use client';

import {useState} from 'react';
import {questions, ColorQuestion} from '../data/questions';

function getRandomQuestion(): ColorQuestion {
  const randomIndex = Math.floor(Math.random() * questions.length);
  return questions[randomIndex];
}

export default function QuizPage() {
  const [showQuiz, setShowQuiz] = useState(false);
  const [currentQuestion, setCurrentQuestion] = useState<ColorQuestion>(
    getRandomQuestion(),
  );
  const [showAnswer, setShowAnswer] = useState(false);

  const handleStartQuiz = () => {
    setShowQuiz(true);
  };

  const handleNextQuestion = () => {
    setCurrentQuestion(getRandomQuestion());
    setShowAnswer(false);
  };

  return (
    <div className='flex flex-col items-center justify-center min-h-screen p-4 bg-gray-100'>
      {showQuiz ? (
        <>
          <div className='text-2xl font-bold mb-4'>
            {showAnswer ? currentQuestion.ans : '？？？'}
          </div>
          <div
            className='w-64 h-64 mb-4'
            style={{
              backgroundColor: `rgb(${currentQuestion.r}, ${currentQuestion.g}, ${currentQuestion.b})`,
            }}
          ></div>
          <button
            className='mb-4 px-4 py-2 bg-blue-500 text-white rounded'
            onClick={() => setShowAnswer(true)}
          >
            解答を表示
          </button>
          <button
            className='px-4 py-2 bg-green-500 text-white rounded'
            onClick={handleNextQuestion}
          >
            次の問題へ
          </button>
        </>
      ) : (
        <div className='text-center'>
          <h1 className='text-4xl font-bold mb-8'>JIS慣用色クイズ</h1>
          <button
            className='px-6 py-3 bg-green-500 text-white text-xl rounded'
            onClick={handleStartQuiz}
          >
            クイズを開始
          </button>
        </div>
      )}
    </div>
  );
}
