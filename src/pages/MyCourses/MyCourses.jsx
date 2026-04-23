import React, { useState } from 'react';
import useGet from '@/hooks/useGet';
import { useNavigate } from 'react-router-dom';
import { 
  Layers, 
  ChevronRight, 
  BookOpen, 
  ArrowLeft,
  ShoppingCart,
  CheckCircle2,
  Wallet,
  X,
  Plus
} from 'lucide-react';
import Loader from '@/components/Loading';
import Errorpage from '@/components/Errorpage';

const MyCourses = () => {
  const navigate = useNavigate();
  const { data, loading, error } = useGet('/api/user/courses');
  const courses = data?.data?.courses || [];

  // 1. حالة "وضع الشراء" (هل المستخدم حالياً بينقي كورسات؟)
  const [isBuyMode, setIsBuyMode] = useState(false);
  // 2. الكورسات اللي اختارها
  const [selectedCourses, setSelectedCourses] = useState([]);

  const toggleCourseSelection = (course) => {
    if (!isBuyMode) return; // لو مش في وضع الشراء، الضغطة متعملش حاجة هنا
    setSelectedCourses((prev) => {
      const isExist = prev.find(c => c.id === course.id);
      if (isExist) return prev.filter(c => c.id !== course.id);
      return [...prev, course];
    });
  };

  const totalPrice = selectedCourses.reduce((sum, item) => sum + (item.price || 0), 0);

  const handleProceedToBuy = () => {
    if (selectedCourses.length === 0) return;
    navigate('/user/enrollment', { 
      state: { 
        type: 'courseId', 
        ids: selectedCourses.map(c => c.id), 
        price: totalPrice,
        name: selectedCourses.length === 1 ? selectedCourses[0].name : `${selectedCourses.length} Courses`
      } 
    });
  };

  if (loading) return <Loader />;
  if (error) return <Errorpage />;

  return (
    <div className="p-4 md:p-6 lg:p-8 mx-auto min-h-screen relative pb-24">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-gray-400 hover:text-gray-900 mb-2 transition-colors font-medium">
            <ArrowLeft className="w-4 h-4" /> Back
          </button>
          <h1 className="text-3xl font-black text-gray-900">Explore Courses</h1>
        </div>

        {/* زرار تفعيل وضع الشراء */}
        {!isBuyMode ? (
          <button 
            onClick={() => setIsBuyMode(true)}
            className="flex items-center gap-2 bg-one text-white px-6 py-3 rounded-2xl font-bold shadow-lg shadow-one/20 hover:scale-105 active:scale-95 transition-all"
          >
            <ShoppingCart className="w-5 h-5" />
            Buy Courses
          </button>
        ) : (
          <button 
            onClick={() => { setIsBuyMode(false); setSelectedCourses([]); }}
            className="flex items-center gap-2 bg-red-50 text-red-600 px-6 py-3 rounded-2xl font-bold border border-red-100 hover:bg-red-100 transition-all"
          >
            <X className="w-5 h-5" />
            Cancel Selection
          </button>
        )}
      </div>

      {/* Grid الكورسات */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {courses.map((course) => {
          const isSelected = selectedCourses.find(c => c.id === course.id);

          return (
            <div 
              key={course.id}
              onClick={() => toggleCourseSelection(course)}
              className={`group relative bg-white rounded-[2.5rem] p-5 flex flex-col h-full transition-all duration-300 border-2 ${
                isBuyMode 
                  ? isSelected ? "border-one ring-4 ring-one/10 shadow-xl scale-[1.02]" : "border-gray-200 cursor-pointer hover:border-one/50"
                  : "border-gray-50 shadow-sm"
              }`}
            >
              {/* أيقونة الاختيار تظهر فقط في وضع الشراء */}
              {isBuyMode && (
                <div className={`absolute -top-2 -right-2 w-8 h-8 rounded-full border-4 border-white flex items-center justify-center shadow-lg transition-all ${
                  isSelected ? "bg-one text-white scale-110" : "bg-gray-100 text-gray-400"
                }`}>
                  {isSelected ? <CheckCircle2 className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
                </div>
              )}

              <div className="aspect-video bg-gray-50 rounded-[2rem] mb-4 overflow-hidden border border-gray-100 flex items-center justify-center group-hover:bg-gray-100 transition-colors">
                 <Layers className={`w-10 h-10 ${isSelected ? 'text-one' : 'text-gray-200'}`} />
              </div>

              <h3 className="text-lg font-bold text-gray-800 mb-2 px-1">{course.name}</h3>
              
              <div className="flex items-center gap-4 px-1 mb-6">
                <div className="flex items-center gap-1 text-xs text-gray-400 font-medium">
                  <BookOpen className="w-3.5 h-3.5" />
                  {course.numberOfChapters} Chapters
                </div>
              </div>

              <div className="flex items-center justify-between mt-auto bg-gray-50 p-3 rounded-2xl">
                <span className="font-black text-gray-900">{course.price} LE</span>
                {!isBuyMode && (
<button
  onClick={(e) => {
    e.stopPropagation();
    navigate(`/user/courses/${course.id}`);
  }}
  className="group flex items-center gap-2 px-4 py-2 bg-white rounded-2xl shadow-md 
             hover:shadow-lg hover:bg-gray-50 active:scale-95 
             transition-all duration-200"
>
  <span className="text-sm font-medium text-gray-700 group-hover:text-one transition-colors">
    See Chapters
  </span>

  <ChevronRight className="w-5 h-5 text-gray-500 group-hover:text-one transform group-hover:translate-x-1 transition-all duration-200" />
</button>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Floating Checkout Bar - يظهر فقط لو في وضع الشراء واختارنا حاجة */}
      {isBuyMode && selectedCourses.length > 0 && (
        <div className="fixed bottom-8 left-1/2 -translate-x-1/2 w-[90%] max-w-md bg-gray-900/95 backdrop-blur-md text-white p-5 rounded-[2.5rem] shadow-2xl z-50 flex items-center justify-between border border-white/10 animate-in fade-in slide-in-from-bottom-8 duration-500">
          <div className="flex flex-col ml-2">
            <span className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">Total Price</span>
            <span className="text-2xl font-black text-one">{totalPrice} <span className="text-xs">LE</span></span>
          </div>
          
          <button 
            onClick={handleProceedToBuy}
            className="bg-one hover:bg-one/90 text-white px-8 py-4 rounded-2xl font-black flex items-center gap-2 transition-all active:scale-95 shadow-lg shadow-one/20"
          >
            Checkout ({selectedCourses.length})
          </button>
        </div>
      )}
    </div>
  );
};

export default MyCourses;