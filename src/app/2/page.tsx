'use client';

import {useState} from 'react';
import {questions, ColorQuestion} from '../../data/questions';
import {HexColorPicker} from 'react-colorful';

function getRandomQuestion(): ColorQuestion {
  const randomIndex = Math.floor(Math.random() * questions.length);
  return questions[randomIndex];
}

function calculateColorDifference(
  r1: number,
  g1: number,
  b1: number,
  r2: number,
  g2: number,
  b2: number,
): number {
  // const [r1, g1, b1] = color1.match(/\d+/g)!.map(Number);
  const diff = Math.sqrt(
    Math.pow(r1 - r2, 2) + Math.pow(g1 - g2, 2) + Math.pow(b1 - b2, 2),
  );
  return Math.round(100 - (diff / Math.sqrt(3 * Math.pow(255, 2))) * 100);
}

export default function QuizPage() {
  const [showQuiz, setShowQuiz] = useState(false);
  const [userColor, setUserColor] = useState<string>('#ffffff');
  const [score, setScore] = useState<number | null>(null);
  const [currentQuestion, setCurrentQuestion] = useState<ColorQuestion>(
    getRandomQuestion(),
  );
  const [showAnswer, setShowAnswer] = useState(false);

  const handleStartQuiz = () => {
    setShowQuiz(true);
  };

  const handleAnswer = () => {
    const [r, g, b] = userColor
      .slice(1)
      .match(/.{1,2}/g)!
      .map((hex) => parseInt(hex, 16));
    const diff = calculateColorDifference(
      r,
      g,
      b,
      currentQuestion.r,
      currentQuestion.g,
      currentQuestion.b,
    );
    setScore(diff);
    setShowAnswer(true);
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
          <input
            type='color'
            value={userColor}
            onChange={(e) => setUserColor(e.target.value)}
          />
          <HexColorPicker color={userColor} onChange={setUserColor} />
          {showAnswer && score ? (
            <div className='text-2xl font-bold h-8'>
              {score >= 85 ? '正解！' : score >= 70 ? 'まあまあ！' : '残念！'} (
              {score}%)
            </div>
          ) : (
            <div className='text-2xl font-bold h-8' />
          )}
          <div
            className='w-48 h-48 mb-4 flex items-center justify-center font-bold text-4xl'
            style={{
              backgroundColor: showAnswer
                ? `rgb(${currentQuestion.r}, ${currentQuestion.g}, ${currentQuestion.b})`
                : 'rgb(200, 200, 200)',
            }}
          >
            {showAnswer ? '' : '？'}
          </div>
          <div className='flex gap-2'>
            <button
              className='btn btn-secondary btn-lg mb-2'
              onClick={handleAnswer}
            >
              解答を表示
            </button>
            <button
              className='btn btn-primary btn-lg'
              onClick={handleNextQuestion}
            >
              次の問題へ
            </button>
          </div>
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
