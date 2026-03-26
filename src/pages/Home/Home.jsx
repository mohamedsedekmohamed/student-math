import React from "react";
import {
  CreditCard,
  Wallet,
  Settings,
  ShoppingBag,
  FileSearch,
  BarChart,
  Clock,FileText 
} from "lucide-react";
import { useNavigate } from "react-router-dom";
const Home = () => {
  const navigator = useNavigate();
  return (
    <div className="p-4">
      <div className="grid  grid-cols-1 lg:grid-cols-3 gap-4">
        {/*payment*/}
        <Card className="p-6 bg-white/20 backdrop-blur-lg border border-white/20 rounded-3xl shadow-xl hover:shadow-2xl transition-all duration-500 group hover:scale-[1.02]">
          <div className="flex flex-col gap-6">
            {/* Icon Container with vibrant glassy gradient */}
            <div className="w-16 h-16 flex items-center justify-center bg-gradient-to-br from-white/30 to-white/10 backdrop-blur-sm border border-white/30 rounded-3xl group-hover:scale-110 transition-transform duration-300">
              <CreditCard className="text-one w-8 h-8" />
            </div>

            {/* Text Section */}
            <div className="space-y-2">
              <h2 className="text-2xl font-bold tracking-tight text-gray-900">
                Payments
              </h2>
              <p className="text-sm text-gray-600">
                Manage your transactions and check your balance easily
              </p>
            </div>

            {/* Buttons Section */}
            <div className="flex items-end gap-4 mt-6">
              {/* Left column: main actions */}
              <div className="flex flex-col flex-1 gap-4">
                <button
                  onClick={() => navigator("/user/payment")}
                  className="flex items-center justify-center gap-3 bg-gradient-to-r from-one to-one/80 text-white px-5 py-3 rounded-2xl font-semibold hover:scale-95 active:scale-95 transition-all shadow-lg hover:shadow-2xl"
                >
                  <CreditCard size={20} />
                  <span>Payment</span>
                </button>

                <button
                  onClick={() => navigator("/user/wallet")}
                  className="flex items-center justify-center gap-3 bg-gradient-to-r from-one to-one/80 text-white px-5 py-3 rounded-2xl font-semibold hover:scale-95 active:scale-95 transition-all shadow-lg hover:shadow-2xl"
                >
                  <Wallet size={20} />
                  <span>Wallet</span>
                </button>
              </div>
            </div>
          </div>
        </Card>
        {/*attend*/}
        <Card className="p-6 bg-white/20 backdrop-blur-lg border border-white/20 rounded-3xl shadow-xl hover:shadow-2xl transition-all duration-500 group hover:scale-[1.02]">
          {" "}
          <div className="flex flex-col gap-6">
            {" "}
            {/* Icon Container with vibrant glassy gradient */}{" "}
            <div className="w-16 h-16 flex items-center justify-center bg-gradient-to-br from-white/30 to-white/10 backdrop-blur-sm border border-white/30 rounded-3xl group-hover:scale-110 transition-transform duration-300">
              {" "}
              <ShoppingBag className="text-one w-8 h-8" />{" "}
            </div>{" "}
            {/* Text Section */}{" "}
            <div className="space-y-2">
              {" "}
              <h2 className="text-2xl font-bold tracking-tight text-gray-900">
                Attend
              </h2>{" "}
              <p className="text-sm text-gray-600">
                Manage your transactions and check your balance easily
              </p>{" "}
            </div>{" "}
            {/* Buttons Section */}{" "}
            <div className="flex items-end gap-4 mt-6">
              {" "}
              {/* Left column: main actions */}{" "}
              <div className="flex flex-col flex-1 gap-4">
                {" "}
                <button
                  onClick={() => navigator("/user/upcoming")}
                  className="flex items-center justify-center gap-3 bg-gradient-to-r from-one to-one/80 text-white px-5 py-3 rounded-2xl font-semibold hover:scale-95 active:scale-95 transition-all shadow-lg hover:shadow-2xl"
                >
                  {" "}
                  <BarChart size={20} /> <span>Upcoming</span>{" "}
                </button>{" "}
                <button
                  onClick={() => navigator("/user/history")}
                  className="flex items-center justify-center gap-3 bg-gradient-to-r from-one to-one/80 text-white px-5 py-3 rounded-2xl font-semibold hover:scale-95 active:scale-95 transition-all shadow-lg hover:shadow-2xl"
                >
                  {" "}
                  <Clock size={20} /> <span>History</span>{" "}
                </button>{" "}
              </div>{" "}
            </div>{" "}
          </div>{" "}
        </Card>
        <Card className="p-6 bg-white/20 backdrop-blur-lg border border-white/20 rounded-3xl shadow-xl hover:shadow-2xl transition-all duration-500 group hover:scale-[1.02]">
          <div className="flex flex-col gap-6">
            {/* Icon */}
            <div className="w-16 h-16 flex items-center justify-center bg-gradient-to-br from-white/30 to-white/10 backdrop-blur-sm border border-white/30 rounded-3xl group-hover:scale-110 transition-transform duration-300">
              <FileSearch className="text-one w-8 h-8" />
            </div>

            {/* Text */}
            <div className="space-y-2">
              <h2 className="text-2xl font-bold tracking-tight text-gray-900">
                 Exams
              </h2>
              <p className="text-sm text-gray-600">
                Take exams, evaluate your level, and track your performance
              </p>
            </div>

            {/* Buttons */}
            <div className="flex items-end gap-4 mt-6">
              <div className="flex flex-col flex-1 gap-4">
                <button
                  // onClick={() => navigator("/user/exams")}
                  className="flex items-center justify-center gap-3 bg-gradient-to-r from-one to-one/80 text-white px-5 py-3 rounded-2xl font-semibold hover:scale-95 active:scale-95 transition-all shadow-lg hover:shadow-2xl"
                >
                  <FileText size={20} />
                  <span> Exam</span>
                </button>

                <button
                  onClick={() => navigator("/user/diagnostic")}
                  className="flex items-center justify-center gap-3 bg-gradient-to-r from-one to-one/80 text-white px-5 py-3 rounded-2xl font-semibold hover:scale-95 active:scale-95 transition-all shadow-lg hover:shadow-2xl"
                >
                  <BarChart size={20} />
                  <span>Diagnostic  Exam</span>
                </button>
              </div>
            </div>
          </div>
        </Card>

        <Card>
          <h2 className="text-lg font-bold">Card 3</h2>
          <img
            src="https://via.placeholder.com/150"
            alt=""
            className="rounded"
          />
        </Card>

        <Card>
          <h2 className="text-lg font-bold">Card 4</h2>
        </Card>

        <Card>
          <h2 className="text-lg font-bold">Card 5</h2>
        </Card>

        <Card>
          <h2 className="text-lg font-bold">Card 6</h2>
        </Card>

        <Card>
          <h2 className="text-lg font-bold">Card 7</h2>
        </Card>

        <Card>
          <h2 className="text-lg font-bold">Card 8</h2>
        </Card>
      </div>
    </div>
  );
};

export default Home;

const Card = ({ children }) => {
  return (
    <div className="bg-white rounded-2xl shadow-md p-4 min-h-[150px] hover:shadow-xl transition">
      {children}
    </div>
  );
};
