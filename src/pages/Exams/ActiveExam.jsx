import React, { useState, useEffect } from 'react';
import { 
  CheckCircle, Clock, ChevronRight, ChevronLeft, ArrowLeft, 
  LayoutGrid, Calculator, X, BarChart, XCircle, AlertCircle, 
  LineChart as LineChartIcon, FunctionSquare 
} from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine } from 'recharts';
import Calc from '../../components/Calc'
import GraphViewer from '../../components/GraphViewer'

// ==========================================
// 2. شاشة الامتحان الأساسية
// ==========================================
const ActiveExam = ({ exam, onExit }) => {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState({}); 
  
  const [showCalculator, setShowCalculator] = useState(false);
  const [showGraph, setShowGraph] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [scoreData, setScoreData] = useState(null);

  const question = exam.questions[currentQuestionIndex];
  const isLastQuestion = currentQuestionIndex === exam.questions.length - 1;

  const handleSelectOption = (option) => {
    setAnswers({
      ...answers,
      [question.id]: option
    });
  };

  const handleSubmit = () => {
    const unansweredCount = exam.questions.length - Object.keys(answers).length;
    
    if (unansweredCount > 0) {
      const confirmSubmit = window.confirm(`You have ${unansweredCount} unanswered questions. Are you sure you want to submit?`);
      if (!confirmSubmit) return;
    }

    let correct = 0;
    let incorrect = 0;
    let unattempted = 0;

    exam.questions.forEach((q) => {
      const studentAnswer = answers[q.id];
      if (!studentAnswer) {
        unattempted++;
      } else if (studentAnswer === q.correctAnswer) {
        correct++;
      } else {
        incorrect++;
      }
    });

    setScoreData({
      correct,
      incorrect,
      unattempted,
      total: exam.questions.length,
      percentage: Math.round((correct / exam.questions.length) * 100)
    });

    setIsSubmitted(true);
  };

  // شاشة النتيجة
  if (isSubmitted && scoreData) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-6 font-sans w-screen">
        <div className="bg-white max-w-2xl w-full rounded-2xl shadow-lg border border-gray-100 p-8 text-center animate-in fade-in zoom-in duration-300">
          <div className="w-20 h-20 bg-one/10 text-one rounded-full flex items-center justify-center mx-auto mb-6">
            <BarChart className="w-10 h-10" />
          </div>
          <h2 className="text-3xl font-bold text-gray-900 mb-2">Exam Completed!</h2>
          <p className="text-gray-500 mb-8">Here is your performance summary for {exam.title}</p>
          
          <div className="grid grid-cols-3 gap-4 mb-8">
            <div className="bg-green-50 border border-green-100 p-4 rounded-xl">
              <CheckCircle className="w-8 h-8 text-green-500 mx-auto mb-2" />
              <p className="text-2xl font-bold text-green-700">{scoreData.correct}</p>
              <p className="text-sm text-green-600 font-medium">Correct</p>
            </div>
            <div className="bg-red-50 border border-red-100 p-4 rounded-xl">
              <XCircle className="w-8 h-8 text-red-500 mx-auto mb-2" />
              <p className="text-2xl font-bold text-red-700">{scoreData.incorrect}</p>
              <p className="text-sm text-red-600 font-medium">Incorrect</p>
            </div>
            <div className="bg-gray-50 border border-gray-200 p-4 rounded-xl">
              <AlertCircle className="w-8 h-8 text-gray-400 mx-auto mb-2" />
              <p className="text-2xl font-bold text-gray-700">{scoreData.unattempted}</p>
              <p className="text-sm text-gray-500 font-medium">Unattempted</p>
            </div>
          </div>

          <div className="bg-one/10 text-one p-6 rounded-xl mb-8 font-semibold text-lg flex justify-between items-center">
            <span>Final Score:</span>
            <span className="text-3xl">{scoreData.percentage}%</span>
          </div>

          <button 
            onClick={onExit}
            className="w-full bg-one hover:bg-one/80 text-white font-bold py-3 px-6 rounded-lg transition-colors"
          >
            Return to Dashboard
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center font-sans relative w-screen">
      
      {/* نافذة الحاسبة */}
       {/* خلفية ضبابية (Backdrop) بتظهر لما أي أداة تتفتح */}
{(showCalculator || showGraph) && (
  <div 
    className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 animate-in fade-in duration-200"
    // onClick={() => { setShowCalculator(false); setShowGraph(false); }} // تقدر تفعل دي عشان يقفل لما يدوس برا
  />
)}

{/* نافذة الآلة الحاسبة */}
{showCalculator && (
  <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-[360px] h-fit z-50 animate-in fade-in zoom-in-95 duration-200 ease-out flex justify-center">
    {/* زرار إغلاق اختياري فوق الآلة */}
    <div className="relative w-full flex justify-center">
      <button 
        onClick={() => setShowCalculator(false)}
        className="absolute -top-10 right-2 text-white/70 hover:text-white bg-black/20 hover:bg-black/50 rounded-full p-2 transition-all"
      >
        ✕
      </button>
      <Calc />
    </div>
  </div>
)}

{/* نافذة الرسم البياني */}
{showGraph && (
  <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[95%] md:w-[850px] h-[85vh] md:h-[650px] z-50 bg-[#0f1115] rounded-2xl shadow-[0_0_40px_rgba(0,0,0,0.5)] border border-gray-800 animate-in fade-in zoom-in-95 duration-200 ease-out flex flex-col overflow-hidden">
    
    {/* شريط علوي (Header) للنافذة */}
    <div className="flex justify-between items-center px-4 py-3 bg-gray-900 border-b border-gray-800">
      <div className="flex items-center gap-2">
        <div className="w-3 h-3 rounded-full bg-red-500"></div>
        <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
        <div className="w-3 h-3 rounded-full bg-green-500"></div>
        <span className="ml-2 text-gray-300 font-medium text-sm">Graphing Engine</span>
      </div>
      <button 
        onClick={() => setShowGraph(false)} 
        className="text-gray-400 hover:text-red-400 transition-colors"
      >
        ✕
      </button>
    </div>

    {/* مساحة الـ GraphViewer */}
    <div className="flex-1 relative w-full h-full">
      <GraphViewer />
    </div>
  </div>
)}
      {/* الهيدر العلوي */}
      <div className="w-full bg-white border-b border-gray-200 px-6 py-4 flex justify-between items-center shadow-sm sticky top-0 z-10">
        <div className="flex items-center gap-4">
          <button onClick={onExit} className="text-gray-500 hover:text-gray-800 transition">
            <ArrowLeft className="w-5 h-5" />
          </button>
          <h1 className="text-xl font-bold text-gray-800 hidden md:block">{exam.title}</h1>
        </div>
        
        <div className="flex items-center gap-2 md:gap-4">
          
          {/* زر الآلة الحاسبة */}
          <button 
            onClick={() => {
              setShowCalculator(!showCalculator);
              setShowGraph(false); // إغلاق الرسم البياني إذا كان مفتوحاً
            }}
            title="Calculator"
            className={`group flex items-center justify-center p-2 md:px-4 md:py-2 rounded-lg font-medium transition-all duration-200 border shadow-sm active:scale-95 ${
              showCalculator 
                ? 'bg-one text-white border-one shadow-md' 
                : 'bg-white text-gray-700 border-gray-200 hover:bg-gray-50 hover:border-gray-300'
            }`}
          >
            <Calculator className={`w-5 h-5 md:mr-2 transition-transform ${showCalculator ? 'scale-110' : ''}`} />
            <span className="hidden md:block">Calculator</span>
          </button>

          {/* زر الرسم البياني */}
          <button 
            onClick={() => {
              setShowGraph(!showGraph);
              setShowCalculator(false); // إغلاق الآلة الحاسبة إذا كانت مفتوحة
            }}
            title="Graph"
            className={`group flex items-center justify-center p-2 md:px-4 md:py-2 rounded-lg font-medium transition-all duration-200 border shadow-sm active:scale-95 ${
              showGraph 
                ? 'bg-purple-600 text-white border-purple-600 shadow-md shadow-purple-200/50' 
                : 'bg-white text-gray-700 border-gray-200 hover:bg-gray-50 hover:border-gray-300'
            }`}
          >
            <LineChartIcon className={`w-5 h-5 md:mr-2 transition-transform ${showGraph ? 'scale-110' : ''}`} />
            <span className="hidden md:block">Graph</span>
          </button>   

          {/* فاصل مرئي */}
          <div className="hidden md:block w-px h-8 bg-gray-200 mx-1"></div>

          {/* المؤقت الزمني */}
          <div className="flex items-center text-one font-bold bg-one/10 px-3 py-2 md:px-4 md:py-2 rounded-lg border border-one/20 shadow-inner">
            <Clock className="w-5 h-5 mr-1.5 md:mr-2 animate-pulse text-one/80" />
            <span className="tracking-wider tabular-nums">60:00</span>
          </div>

        </div>
      </div>

      <div className="flex-grow flex flex-col w-full max-w-7xl p-4 gap-6">
        
        <div className="w-full bg-white rounded-xl shadow-sm border border-gray-100 py-3 mt-4 mb-4 flex flex-col h-fit">
          <div className='flex justify-between flex-col md:flex-row gap-4 mb-6 border-b border-gray-100 pb-4 px-6'>
            <div className="flex items-center gap-2 text-gray-800 font-semibold">
              <LayoutGrid className="w-5 h-5" />
              <h3>Question Navigation</h3>
            </div>

            <div className="flex space-x-4 text-sm text-gray-600">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-one"></div>
                <span>Answered</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-gray-200"></div>
                <span>Not Answered</span>
              </div>
            </div>
          </div>
          
          <div className="flex flex-wrap gap-x-4 gap-y-3 custom-scrollbar px-6 overflow-y-auto max-h-48">
            {exam.questions.map((q, index) => {
              const isAnswered = answers[q.id] !== undefined;
              const isActive = currentQuestionIndex === index;
              
              return (
                <button
                  key={q.id}
                  onClick={() => setCurrentQuestionIndex(index)}
                  className={`w-10 h-10 flex items-center justify-center rounded-lg font-medium text-sm transition-all duration-200
                    ${isActive ? 'ring-2 ring-one/60 ring-offset-2' : ''}
                    ${isAnswered ? 'bg-one text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}
                  `}
                >
                  {index + 1}
                </button>
              );
            })}
          </div>
        </div>

        <div className="flex-grow flex flex-col bg-white rounded-xl shadow-sm border border-gray-100 p-6 md:p-8">
          <div className="flex justify-between text-sm text-gray-500 mb-6 font-medium border-b border-gray-100 pb-4">
            <span>Question {currentQuestionIndex + 1} of {exam.questions.length}</span>
          </div>
          
          <h2 className="text-2xl font-semibold text-gray-900 mb-8 leading-relaxed">
            {question.text}
          </h2>

          <div className="space-y-4 mb-8 flex-grow">
            {question.options.map((option, index) => {
              const isSelected = answers[question.id] === option;
              return (
                <label 
                  key={index} 
                  className={`flex items-center p-4 border-2 rounded-lg cursor-pointer transition-all ${
                    isSelected ? 'border-one/60 bg-one/10' : 'border-gray-200 hover:border-one/30 hover:bg-gray-50'
                  }`}
                >
                  <input 
                    type="radio" 
                    name={question.id} 
                    value={option} 
                    checked={isSelected}
                    onChange={() => handleSelectOption(option)}
                    className="w-5 h-5 text-one focus:ring-one/50 border-gray-300"
                  />
                  <span className={`ml-3 text-lg ${isSelected ? 'text-one font-medium' : 'text-gray-700'}`}>
                    {option}
                  </span>
                </label>
              );
            })}
          </div>

          <div className="flex justify-between items-center mt-auto pt-6 border-t border-gray-100">
            <button 
              disabled={currentQuestionIndex === 0}
              onClick={() => setCurrentQuestionIndex(prev => prev - 1)}
              className="flex items-center px-6 py-2.5 rounded-lg font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed transition"
            >
              <ChevronLeft className="w-5 h-5 mr-1" />
              Previous
            </button>

            {isLastQuestion ? (
              <button 
                onClick={handleSubmit}
                className="flex items-center px-8 py-2.5 rounded-lg font-medium text-white bg-green-600 hover:bg-green-700 transition shadow-md"
              >
                Submit Exam
                <CheckCircle className="w-5 h-5 ml-2" />
              </button>
            ) : (
              <button 
                onClick={() => setCurrentQuestionIndex(prev => prev + 1)}
                className="flex items-center px-8 py-2.5 rounded-lg font-medium text-white bg-one hover:bg-one/80 transition shadow-sm"
              >
                Next
                <ChevronRight className="w-5 h-5 ml-1" />
              </button>
            )}
          </div>
        </div>

      </div>
    </div>
  );
};

export default ActiveExam;