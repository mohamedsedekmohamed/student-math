import { createBrowserRouter } from "react-router-dom";
import Login from "../Auth/Login";
import SaveRoute from "../Auth/SaveRoute";
import AdminLayout from "../Layout/AdminLayout";
import Home from "../pages/Home/Home";
import Loading from "../components/Loading";
import Exams from "../pages/Exams/Exams";
const router = createBrowserRouter([
  {
    path: "/",
    element: <Login />,
  },
  {
    path: "/user/*",
    element: (
      <SaveRoute>
        <AdminLayout />
      </SaveRoute>
    ),
    children: [
      { index: true, element: <Home /> },
      { path: "loading", element: <Loading /> },
      { path: "exams", element: <Exams /> },
    ],
  },
]);

export default router;
