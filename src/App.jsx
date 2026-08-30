import { createBrowserRouter, RouterProvider, Navigate } from "react-router-dom"
import Home from "./Components/Home/Home"
import Login from "./Components/Login/Login"
import Emergencies from "./Components/Emergencies/Emergencies"
import Profile from "./Components/Profile/Profile"
import Learn from "./Components/Learn/Learn"
import Post from "./Components/Post/Post"
import Community from "./Components/Community/Community"
import SignUp from "./Components/SignUp/SignUp"
import Otp from "./Components/Otp/Otp"
import Settings from "./Components/Settings/Settings"
import Error from "./Components/Error/Error"
import { useContext } from "react"
import { ContextProvider } from "./context/ContextApi"

// Guard: redirect to /login if the user is not authenticated
const ProtectedRoute = ({ children }) => {
  const { user } = useContext(ContextProvider)
  if (!user) return <Navigate to="/login" replace />
  return children
}

const App = () => {
  const router = createBrowserRouter([
    {
      path: '/',
      element: (
        <ProtectedRoute>
          <Home />
        </ProtectedRoute>
      ),
      children: [
        {
          index: true,
          element: <Emergencies />,
        },
        {
          path: 'profile',
          element: <Profile />,
        },
        {
          path: 'learn',
          element: <Learn />,
        },
        {
          path: 'post',
          element: <Post />,
        },
        {
          path: 'setting',
          element: <Settings />,
        },
        {
          path: 'community',
          element: <Community />,
        },
      ],
    },
    {
      path: "/login",
      element: <Login />,
    },
    {
      path: "/signUp",
      element: <SignUp />,
    },
    {
      path: "/otp",
      element: <Otp />,
    },
    {
      path: "*",
      element: <Error />,
    },
  ])

  return (
    <div>
      <RouterProvider router={router} />
    </div>
  )
}

export default App