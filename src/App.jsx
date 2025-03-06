import { createBrowserRouter, RouterProvider } from "react-router-dom"
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
import Details from "./Components/Details/Details"
import Error from "./Components/Error/Error"

const App = () => {

  const router = createBrowserRouter([
    {
      path: '/',
      element: <Home />,
      children: [
        {
          path: "/",
          element: <Emergencies />
        },
        {
          path: 'profile',
          element: <Profile />
        },
        {
          path: 'learn',
          element: <Learn/>
        },
        {
          path: 'emergencies/:id',
          element: <Details />
        },
        {
          path: "post",
          element: <Post />
        },
        {
          path: "setting",
          element: <Settings />
        },
        {
          path: 'community',
          element: <Community />
        }
      ]

    },
    {
      path: "/login",
      element: <Login />
    },
    {
      path: "/signUp",
      element: <SignUp />
    },
    {
      path: "/otp",
      element: <Otp />
    },
    {
      path: "*",
      element: <Error />
    }
  ])

  return (
    <div className="">
      <RouterProvider router={router} />
    </div>
  )
}

export default App