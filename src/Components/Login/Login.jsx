import "./Login.css";
import eye1 from "../../assets/eye1.svg";
import eye2 from "../../assets/eye2.svg";
import { useContext, useState } from "react";
import { ContextProvider } from "../../context/ContextApi";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import axios from "axios";
const Login = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [error, setError] = useState(false);
  const navigate = useNavigate();
  const { UpdateUser, UpdateToken } = useContext(ContextProvider);

  const FetchUser = async () => {
    try {
      const response = await axios.post(
        "http://localhost:4000/api/v1/users/login",
        formData
      );
      const data = await response.data;
      if (data) {
        UpdateUser(data.data);
        UpdateToken(data.token);
        navigate("/");
      }
    } catch (err) {
      console.log(err);
    }
  };

  const HandleInput = (e) => {
    const name = e.target.name;
    const value = e.target.value;
    setFormData({ ...formData, [name]: value });
  };

  const HandleShowPassword = () => {
    setShowPassword(!showPassword);
  };
  const HandleSubmit = () => {
    if (formData.email === "" || formData.password === "") {
      setError(
        "fill all the fields with a message and close the form when you click"
      );
    } else {
      console.log(formData);
      setError(false);
      FetchUser();
    }
  };

  return (
    <motion.section
      initial={{ scale: 1.4, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{
        duration: 0.6,
        type: "spring",
        damping: 13,
        stiffness: 200,
      }}
      className="loginPage"
    >
      <div className="title">
        <h1>Login</h1>
        <h1>Hi! Welcome</h1>
      </div>

      <form
        action="#"
        onSubmit={(e) => {
          e.preventDefault();
          HandleSubmit(e);
        }}
      >
        <div className="input">
          <label htmlFor="email">Email Address</label>
          <input
            id="email"
            type="text"
            placeholder=""
            name="email"
            value={formData.email}
            onChange={(e) => HandleInput(e)}
          />
        </div>

        <div className="input">
          <label htmlFor="password">Password</label>
          <input
            id="password"
            type={showPassword ? "text" : "password"}
            placeholder=""
            name="password"
            value={formData.password}
            onChange={(e) => HandleInput(e)}
          />
          <img
            className="showPassword"
            src={showPassword ? eye2 : eye1}
            onClick={() => {
              HandleShowPassword();
            }}
            alt=""
          />
        </div>
        <p className="forget">Forgotten your password ?</p>
        {error && <p className="error">{error}</p>}
        <button type="submit">Log In</button>
      </form>

      <div className="footer">
        <p>
          I Don’t have an account ?
          <span onClick={() => navigate("/signUp")}>Create an Account</span>
        </p>
      </div>
    </motion.section>
  );
};

export default Login;
