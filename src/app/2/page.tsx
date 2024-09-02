'use client';

import {useState, useEffect} from 'react';
import {questions, ColorQuestion} from '../../data/questions';
import {HexColorPicker} from 'react-colorful';

function getRandomQuestion(remainingQuestions: ColorQuestion[]): ColorQuestion {
  const randomIndex = Math.floor(Math.random() * remainingQuestions.length);
  return remainingQuestions[randomIndex];
}

function calculateColorDifference(
  r1: number,
  g1: number,
  b1: number,
  r2: number,
  g2: number,
  b2: number,
): number {
  const diff = Math.sqrt(
    Math.pow(r1 - r2, 2) + Math.pow(g1 - g2, 2) + Math.pow(b1 - b2, 2),
  );
  return Math.round(100 - (diff / Math.sqrt(3 * Math.pow(255, 2))) * 100);
}

export default function QuizPage() {
  const [showQuiz, setShowQuiz] = useState(false);
  const [userColor, setUserColor] = useState<string>('#ffffff');
  const [score, setScore] = useState<number | null>(null);
  const [remainingQuestions, setRemainingQuestions] = useState<ColorQuestion[]>(
    [],
  );
  const [currentQuestion, setCurrentQuestion] = useState<ColorQuestion | null>(
    null,
  );
  const [showAnswer, setShowAnswer] = useState(false);
  const [quizStarted, setQuizStarted] = useState(false);

  useEffect(() => {
    const savedData = localStorage.getItem('quizProgress');
    if (savedData) {
      const parsedData = JSON.parse(savedData);
      setRemainingQuestions(parsedData.remainingQuestions);
      setCurrentQuestion(parsedData.currentQuestion);
    }
  }, []);

  useEffect(() => {
    if (quizStarted) {
      localStorage.setItem(
        'quizProgress',
        JSON.stringify({remainingQuestions, currentQuestion}),
      );
    }
  }, [remainingQuestions, currentQuestion, quizStarted]);

  const handleStartQuiz = () => {
    const initialQuestions = [...questions];
    setRemainingQuestions(initialQuestions);
    setCurrentQuestion(getRandomQuestion(initialQuestions));
    setQuizStarted(true);
    setShowQuiz(true);
    setShowAnswer(false);
    setScore(null);
    localStorage.removeItem('quizProgress');
  };

  const handleContinueQuiz = () => {
    setShowQuiz(true);
    setQuizStarted(true);
  };

  const handleAnswer = () => {
    if (currentQuestion) {
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
    }
  };

  const handleNextQuestion = () => {
    const newRemainingQuestions =
      score && score >= 85
        ? remainingQuestions.filter((q) => q !== currentQuestion)
        : [...remainingQuestions];
    if (newRemainingQuestions.length > 0) {
      const nextQuestion = getRandomQuestion(newRemainingQuestions);
      setCurrentQuestion(nextQuestion);
      setRemainingQuestions(newRemainingQuestions);
      setShowAnswer(false);
      setScore(null);
    } else {
      alert('全ての問題を解きました！');
      localStorage.removeItem('quizProgress');
      setShowQuiz(false);
      setQuizStarted(false);
    }
  };

  return (
    <div className='flex flex-col items-center justify-center min-h-screen p-4 bg-base-200 text-base-content'>
      {showQuiz ? (
        <>
          <div>
            現在の正解数：{questions.length - remainingQuestions.length} /{' '}
            {questions.length} 問
          </div>
          <div className='text-2xl font-bold mb-4'>{currentQuestion?.ans}</div>
          <input
            type='color'
            value={userColor}
            onChange={(e) => setUserColor(e.target.value)}
          />
          <HexColorPicker color={userColor} onChange={setUserColor} />
          {showAnswer && score !== null ? (
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
                ? `rgb(${currentQuestion?.r}, ${currentQuestion?.g}, ${currentQuestion?.b})`
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
            はじめから
          </button>
          <button
            className='btn btn-secondary btn-lg ml-4'
            onClick={handleContinueQuiz}
            disabled={remainingQuestions.length == 0}
          >
            つづきから
          </button>
        </div>
      )}
    </div>
  );
}
