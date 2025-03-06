import { Outlet } from "react-router-dom";
import Navbar from "../Navbar/Navbar";
import { useContext } from "react";
import { ContextProvider } from "../../context/ContextApi";
import Main from "../Main/Main";

const Home = () => {
  const { user } = useContext(ContextProvider);

  return user ? (
    <div className="container">
      <Navbar />
      <div className="home_content">

      <Outlet />
      </div>
    </div>
  ) : (
    <Main />
  );
};

export default Home;
