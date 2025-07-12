import { Button } from "@/components/ui/button"
import { createBrowserRouter , RouterProvider} from "react-router-dom";
import Signup from "./components/AuthPages/Signup";
import Login from "./components/AuthPages/Login";
import { Toaster } from "sonner";
const router = createBrowserRouter([
  // {path:"/",element:<HomePage/>},
  {path:"/register",element:<Signup/>},
  {path:"/login",element:<Login/>}
])


function App() {
  return (
    <div className="p-4 h-screen flex items-center justify-center">
 <Toaster position="top-right" reverseOrder={false} />
   <RouterProvider router={router}/>
  </div>
  )
}

export default App