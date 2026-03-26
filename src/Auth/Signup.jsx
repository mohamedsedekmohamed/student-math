import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import { 
  TbMathFunction, 
  TbUser, 
  TbMail, 
  TbLock, 
  TbPhone, 
  TbSchool, 
  TbChevronLeft 
} from "react-icons/tb";

// Hooks اللي أنت عملتها
import usePost from "@/hooks/usePost";
import useGet from "@/hooks/useGet";

// --- 1. المكون الفرعي (بره عشان مشكلة الكتابة متتكررش) ---
const FormInput = ({ icon: Icon, ...props }) => (
  <div className="relative group">
    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400 group-focus-within:text-one transition-colors">
      <Icon size={20} />
    </div>
    <input
      {...props}
      className="w-full pl-11 pr-4 py-3.5 bg-slate-50 border border-slate-200 rounded-2xl focus:bg-white focus:ring-4 focus:ring-one/10 focus:border-one outline-none transition-all duration-200"
    />
  </div>
);

// --- 2. المكون الأساسي ---
const Signup = () => {
  const navigate = useNavigate();
  
  // استخدام الـ Hooks بتاعتك
  const { postData, loading: posting } = usePost();
  const { data: selectData } = useGet("/api/user/auth/select");

  const [form, setForm] = useState({
    firstname: "",
    lastname: "",
    nickname: "",
    email: "",
    password: "",
    phone: "",
    category: "",
    grade: "",
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSignup = async (e) => {
    e.preventDefault();
    try {
      // بنبعت الداتا للـ Hook بتاعك
      await postData(form, "/api/user/auth/signup", "Welcome to MathPortal! 🎉");
      navigate("/message", { state: { email: form.email } });
    } catch (err) {
      console.error("Signup error:", err);
    }
  };

  return (
    <div className="min-h-screen flex bg-slate-50 font-sans text-left">
      
      {/* الجانب الأيسر: براندينج وصورة (يظهر في الشاشات الكبيرة فقط) */}
      <div className="hidden lg:flex lg:w-1/2 relative p-12 items-center justify-center overflow-hidden">
        <img
          src="https://images.unsplash.com/photo-1635070041078-e363dbe005cb?q=80&w=2000"
          alt="Mathematics"
          className="absolute inset-0 w-full h-full object-cover scale-110 blur-[1px]"
        />
        <div className="absolute inset-0 bg-gradient-to-br from-one/95 via-one/80 to-transparent"></div>
        
        <div className="relative z-10 w-full max-w-md">
          <div className="bg-white/10 backdrop-blur-xl p-10 rounded-[2.5rem] border border-white/20 shadow-2xl text-white">
            <TbMathFunction className="text-5xl mb-6" />
            <h2 className="text-4xl font-extrabold mb-4 leading-tight">Master Math <br/> With Ease.</h2>
            <p className="text-slate-100 text-lg opacity-90">
              Join MathPortal today and access a world of interactive exams and expert guidance.
            </p>
          </div>
        </div>
      </div>

      {/* الجانب الأيمن: الفورم */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-6 sm:p-12 bg-white">
        <div className="w-full max-w-xl">
          
          {/* زرار الرجوع واللوجو للموبايل */}
          <div className="flex items-center justify-between mb-8">
            <button 
              onClick={() => navigate("/")}
              className="flex items-center gap-2 text-slate-500 hover:text-one transition-colors font-medium"
            >
              <TbChevronLeft /> Back
            </button>
            <div className="lg:hidden flex items-center gap-2">
              <div className="w-8 h-8 bg-one rounded-lg flex items-center justify-center shadow-lg shadow-one/20">
                <TbMathFunction className="text-white" />
              </div>
              <span className="font-bold text-slate-900">MathPortal</span>
            </div>
          </div>

          <div className="mb-10">
            <h1 className="text-3xl font-bold text-slate-900 mb-2">Create Account</h1>
            <p className="text-slate-500">Enter your information to start your journey.</p>
          </div>

          <form onSubmit={handleSignup} className="space-y-4">
            
            {/* صف الاسم الأول والأخير */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <FormInput icon={TbUser} name="firstname" placeholder="First Name" value={form.firstname} onChange={handleChange} required />
              <FormInput icon={TbUser} name="lastname" placeholder="Last Name" value={form.lastname} onChange={handleChange} required />
            </div>

            {/* صف النيك نيم والموبايل */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <FormInput icon={TbUser} name="nickname" placeholder="Nickname" value={form.nickname} onChange={handleChange} required  />
              <FormInput icon={TbPhone} name="phone" placeholder="Phone Number" value={form.phone} onChange={handleChange} required type="number" />
            </div>

            <FormInput icon={TbMail} name="email" type="email" placeholder="Email Address" value={form.email} onChange={handleChange} required />
            <FormInput icon={TbLock} name="password" type="password" placeholder="Password" value={form.password} onChange={handleChange} required />

            {/* صف القسم والسنة الدراسية */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="relative group">
                <TbSchool className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-one z-10" size={20} />
                <select
                  name="category"
                  value={form.category}
                  onChange={handleChange}
                  className="w-full pl-11 pr-4 py-3.5 bg-slate-50 border border-slate-200 rounded-2xl appearance-none focus:ring-4 focus:ring-one/10 focus:border-one outline-none transition-all"
                  required
                >
                  <option value="">Select Category</option>
                  {selectData?.data?.categories?.map((cat) => (
                    <option key={cat.id} value={cat.id}>{cat.name}</option>
                  ))}
                </select>
              </div>

              <div className="relative group">
                <TbSchool className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-one z-10" size={20} />
                <select
                  name="grade"
                  value={form.grade}
                  onChange={handleChange}
                  className="w-full pl-11 pr-4 py-3.5 bg-slate-50 border border-slate-200 rounded-2xl appearance-none focus:ring-4 focus:ring-one/10 focus:border-one outline-none transition-all"
                  required
                >
                  <option value="">Select Grade</option>
                  {selectData?.data?.grades?.map((g) => (
                    <option key={g} value={g}>Grade {g}</option>
                  ))}
                </select>
              </div>
            </div>

            <button
              type="submit"
              disabled={posting}
              className="w-full bg-one hover:bg-[#5a0707] disabled:bg-slate-300 text-white font-bold py-4 rounded-2xl shadow-lg shadow-one/20 transition-all active:scale-[0.98] flex items-center justify-center gap-3 mt-4"
            >
              {posting ? (
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                "Create Account"
              )}
            </button>
          </form>

          <div className="text-center mt-8 text-slate-600">
            Already have an account? 
            <button onClick={() => navigate("/")} className="text-one font-bold ml-1 hover:underline">
              Login
            </button>
          </div>
        </div>
      </div>

      <Toaster position="top-right" />
    </div>
  );
};

export default Signup;