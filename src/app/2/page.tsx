'use client';

import {useState} from 'react';
import {questions, ColorQuestion} from '../../data/questions';

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
    <div className='flex flex-col items-center justify-center min-h-svh p-4 bg-base-200 text-base-content'>
      {showQuiz ? (
        <>
          <div className='text-2xl font-bold mb-4'>{currentQuestion.ans}</div>
          <div
            className='w-64 h-64 mb-4 flex items-center justify-center font-bold text-4xl'
            style={{
              backgroundColor: showAnswer
                ? `rgb(${currentQuestion.r}, ${currentQuestion.g}, ${currentQuestion.b})`
                : 'rgb(200, 200, 200)',
            }}
          >
            {showAnswer ? '' : '？'}
          </div>
          <button
            className='btn btn-secondary btn-lg mb-2'
            onClick={() => setShowAnswer(true)}
          >
            解答を表示
          </button>
          <button
            className='btn btn-primary btn-lg'
            onClick={handleNextQuestion}
          >
            次の問題へ
          </button>
        </>
      ) : (
        <div className='text-center'>
          <h1 className='text-4xl font-bold mb-8'>JIS慣用色クイズ</h1>
          <button className='btn btn-primary btn-lg' onClick={handleStartQuiz}>
            クイズを開始
          </button>
        </div>
      )}
    </div>
  );
}
