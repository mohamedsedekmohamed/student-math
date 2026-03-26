import React, { useState } from "react";
import { useParams } from "react-router-dom";
import useGet from "@/hooks/useGet";
import Loader from "@/components/Loading";
import Errorpage from "@/components/Errorpage";

const Review = () => {
  const { attemptId } = useParams();
  const [expandedRow, setExpandedRow] = useState(null);

  const { data, loading, error } = useGet(
    `/api/user/diagnostic-exams/attempts/${attemptId}/review`
  );

  const questions = Array.isArray(data?.data?.data)
    ? data.data.data
    : Array.isArray(data?.data)
    ? data.data
    : Array.isArray(data)
    ? data
    : [];

  if (loading) return <Loader />;
  if (error) return <Errorpage />;

  if (!questions || questions.length === 0) {
    return (
      <div className="h-screen flex items-center justify-center text-gray-500 font-medium">
        No review data found.
      </div>
    );
  }

  // 👇 1. تجميع الأسئلة الصح والغلط لتكوين الملخص اللي فوق
  const correctQuestions = [];
  const incorrectQuestions = [];

  questions.forEach((q, index) => {
    const isMCQ = q.answerType === "MCQ";
    const correctOption = q.correctAnswers?.[0];
    const correctAnswersText = q.correctAnswers?.map((a) => a.answerText) || [];

    const isCorrect =
      (isMCQ && q.studentSubmittedMCQId === correctOption?.optionId) ||
      (!isMCQ && correctAnswersText.includes(q.studentSubmittedGridInText));

    if (isCorrect) {
      correctQuestions.push(index + 1);
    } else {
      incorrectQuestions.push(index + 1); // الغلط أو اللي متجاوبش هيتحط هنا
    }
  });

  const toggleExplanation = (index) => {
    if (expandedRow === index) {
      setExpandedRow(null);
    } else {
      setExpandedRow(index);
    }
  };

  // دالة النزول للسؤال لما تضغط على رقمه في الملخص
  const scrollToQuestion = (questionNum) => {
    const element = document.getElementById(`question-${questionNum}`);
    if (element) {
      element.scrollIntoView({ behavior: "smooth", block: "center" });
      // ممكن نفتح الشرح بتاعه تلقائي كمان لو تحب
      setExpandedRow(questionNum - 1);
    }
  };

  return (
    <div className="p-6 mx-auto max-w-7xl">
      
      {/* 👇 2. قسم الملخص (المربعات الصح والغلط) */}
      <div className="flex flex-col md:flex-row gap-6 mb-8">
        {/* صندوق الإجابات الصحيحة */}
        <div className="flex-1 border-2 border-green-500 bg-white p-5 rounded-sm">
          <h3 className="text-black font-bold text-lg mb-4">
            Correct Answers ({correctQuestions.length})
          </h3>
          <div className="flex flex-wrap gap-2">
            {correctQuestions.map((num) => (
              <button
                key={num}
                onClick={() => scrollToQuestion(num)}
                className="w-14 h-10 bg-green-100 text-green-800 font-bold flex items-center justify-center rounded-sm hover:bg-green-200 transition-colors cursor-pointer border border-green-200"
              >
                {num}
              </button>
            ))}
            {correctQuestions.length === 0 && (
              <span className="text-slate-400 text-sm">No correct answers.</span>
            )}
          </div>
        </div>

        {/* صندوق الإجابات الخاطئة / المتروكة */}
        <div className="flex-1 border-2 border-red-500 bg-white p-5 rounded-sm">
          <h3 className="text-black font-bold text-lg mb-4">
            Incorrect Answers ({incorrectQuestions.length})
          </h3>
          <div className="flex flex-wrap gap-2">
            {incorrectQuestions.map((num) => (
              <button
                key={num}
                onClick={() => scrollToQuestion(num)}
                className="w-14 h-10 bg-[#fed7aa] text-[#9a3412] font-bold flex items-center justify-center rounded-sm hover:bg-[#fdba74] transition-colors cursor-pointer border border-[#fdba74]"
              >
                {num}
              </button>
            ))}
            {incorrectQuestions.length === 0 && (
              <span className="text-slate-400 text-sm">Perfect! No mistakes.</span>
            )}
          </div>
        </div>
      </div>

      {/* 👇 3. الجدول الأساسي */}
      <div className="border border-gray-200 rounded-xl shadow-sm overflow-hidden bg-white">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-one text-white">
              <th className="p-4 font-bold border-b border-one">Question number</th>
              <th className="p-4 font-bold border-b border-one">Your answer</th>
              <th className="p-4 font-bold border-b border-one">Correct answer</th>
              <th className="p-4 font-bold border-b border-one text-center">Actions</th>
            </tr>
          </thead>
          
          <tbody>
            {questions?.map((q, index) => {
              const isMCQ = q.answerType === "MCQ";
              const correctOption = q.correctAnswers?.[0];
              const correctAnswersText = q.correctAnswers?.map((a) => a.answerText) || [];

              const isCorrect =
                (isMCQ && q.studentSubmittedMCQId === correctOption?.optionId) ||
                (!isMCQ && correctAnswersText.includes(q.studentSubmittedGridInText));

              const hasAnswered = isMCQ 
                ? !!q.studentSubmittedMCQId 
                : !!q.studentSubmittedGridInText;

              let yourAnswerDisplay = "Unanswered";
              if (hasAnswered) {
                if (isMCQ) {
                  yourAnswerDisplay = isCorrect ? correctOption?.answerText : "Wrong";
                } else {
                  yourAnswerDisplay = q.studentSubmittedGridInText;
                }
              }

              const correctAnswerDisplay = isMCQ
                ? correctOption?.answerText
                : correctAnswersText.join(" or ");

              return (
                <React.Fragment key={q.questionId || index}>
                  {/* ضفنا ID هنا عشان الـ Scroll يشتغل لما نضغط على المربع اللي فوق */}
                  <tr 
                    id={`question-${index + 1}`} 
                    className={`border-b border-gray-200 hover:bg-one/5 transition-colors ${index % 2 === 0 ? 'bg-white' : 'bg-slate-50/50'}`}
                  >
                    <td className="p-4 text-slate-700 font-bold">{index + 1}</td>
                    <td className="p-4">
                      <span className={!hasAnswered ? "text-slate-400" : isCorrect ? "text-green-600 font-medium" : "text-red-600 font-medium"}>
                        {yourAnswerDisplay}
                      </span>
                    </td>
                    <td className="p-4 text-slate-800 font-medium">{correctAnswerDisplay}</td>
                    <td className="p-4 text-center">
                      <button
                        onClick={() => toggleExplanation(index)}
                        className="bg-one/10 hover:bg-one hover:text-white text-one px-4 py-2 rounded-md font-medium transition-colors text-sm"
                      >
                        {expandedRow === index ? "Hide explanation" : "View explanation"}
                      </button>
                    </td>
                  </tr>

                  {/* التفاصيل والشرح */}
                  {expandedRow === index && (
                    <tr className="bg-slate-50 shadow-inner">
                      <td colSpan="4" className="p-0 border-b border-gray-200">
                        <div className="p-6 m-4 bg-white border border-slate-200 rounded-xl shadow-sm">
                          <h3 className="font-bold text-lg mb-3 border-b pb-2">Question {index + 1} Details:</h3>
                          
                          <div
                            className="mb-4 text-slate-700 prose prose-sm max-w-none"
                            dangerouslySetInnerHTML={{ __html: q.questionText || "—" }}
                          />

                          {q.questionImage && (
                            <img
                              src={q.questionImage}
                              alt="question"
                              className="w-full max-w-lg max-h-60 object-contain mb-4 rounded-xl border border-slate-200"
                            />
                          )}

                          {(q.explanationContent?.pdf || q.explanationContent?.video) && (
                            <div className="mt-4 pt-4 border-t border-slate-100 space-y-3 bg-slate-50 p-4 rounded-lg">
                              <h4 className="font-bold text-slate-800 flex items-center gap-2">
                                💡 Explanation:
                              </h4>

                              {q.explanationContent?.pdf && (
                                <a
                                  href={q.explanationContent.pdf}
                                  target="_blank"
                                  rel="noreferrer"
                                  className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-800 font-medium underline"
                                >
                                  📄 View PDF Explanation
                                </a>
                              )}

                              {q.explanationContent?.video && (
                                <video
                                  controls
                                  className="w-full max-w-xl max-h-64 rounded-xl border border-slate-200 mt-2 shadow-sm"
                                >
                                  <source src={q.explanationContent.video} type="video/mp4" />
                                </video>
                              )}
                            </div>
                          )}
                        </div>
                      </td>
                    </tr>
                  )}
                </React.Fragment>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Review;