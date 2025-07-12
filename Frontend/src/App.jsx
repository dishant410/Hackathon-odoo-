import { Button } from "@/components/ui/button"
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Signup from "./components/AuthPages/Signup";
import Login from "./components/AuthPages/Login";
import { Toaster } from "sonner";
import { Homepage } from "./components/Homepage";
import ProfilePage from "./components/Profilepage";
import AdminDashboard from "./components/AdminDashboard";
import UserDashboard from "./components/userDashboard";
const router = createBrowserRouter([
  { path: "/", element: <Homepage /> },
  { path: "/register", element: <Signup /> },
  { path: "/login", element: <Login /> },
  { path: "/profile", element: <ProfilePage /> },
  { path: "/admin", element: <AdminDashboard /> },
  { path: "/dashboard", element: <UserDashboard /> }
])


function App() {
  return (
    <div>
      <Toaster position="top-right" reverseOrder={false} />
      <RouterProvider router={router} />
    </div>
  )
}

export default App