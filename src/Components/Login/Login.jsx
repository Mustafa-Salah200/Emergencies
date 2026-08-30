import "./Login.css";
import eye1 from "../../assets/eye1.svg";
import eye2 from "../../assets/eye2.svg";
import { useContext, useState } from "react";
import { ContextProvider } from "../../context/ContextApi";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import axios from "axios";
import { API_BASE } from "../../api";

const Login = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { UpdateUser, UpdateToken } = useContext(ContextProvider);

  const FetchUser = async () => {
    setLoading(true);
    try {
      const response = await axios.post(`${API_BASE}/users/login`, formData);
      const data = response.data;
      if (data.status === "success" && data.data) {
        UpdateUser(data.data);
        UpdateToken(data.data._id);
        navigate("/");
      } else {
        setError("Invalid email or password. Please try again.");
      }
    } catch (err) {
      if (err.response?.status === 401) {
        setError("Invalid email or password. Please try again.");
      } else {
        setError("Something went wrong. Please try again later.");
      }
    } finally {
      setLoading(false);
    }
  };

  const HandleInput = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const HandleSubmit = () => {
    if (!formData.email || !formData.password) {
      setError("Please fill in all fields.");
      return;
    }
    setError(false);
    FetchUser();
  };

  return (
    <motion.div
      className="auth-page"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.4 }}
    >
      <motion.div
        className="auth-card"
        initial={{ y: 30, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5, type: "spring", damping: 18, stiffness: 200 }}
      >
        {/* Brand */}
        <div className="brand">
          <span className="dot" />
          <h2>1stResponse</h2>
        </div>

        <div className="auth-header">
          <h1>Welcome back</h1>
          <p>Sign in to your account to continue</p>
        </div>

        <form onSubmit={(e) => { e.preventDefault(); HandleSubmit(); }}>
          <div className="auth-input-group">
            <label htmlFor="email">Email Address</label>
            <input
              id="email"
              type="email"
              name="email"
              placeholder="you@example.com"
              value={formData.email}
              onChange={HandleInput}
              autoComplete="email"
            />
          </div>

          <div className="auth-input-group">
            <label htmlFor="password">Password</label>
            <input
              id="password"
              type={showPassword ? "text" : "password"}
              name="password"
              placeholder="••••••••"
              value={formData.password}
              onChange={HandleInput}
              autoComplete="current-password"
            />
            <img
              className="eye-toggle"
              src={showPassword ? eye2 : eye1}
              onClick={() => setShowPassword(!showPassword)}
              alt="Toggle password"
            />
          </div>

          <p className="auth-forget">Forgot your password?</p>

          {error && <div className="error-msg">{error}</div>}

          <button className="auth-submit" type="submit" disabled={loading}>
            {loading ? "Signing in…" : "Log In"}
          </button>
        </form>

        <div className="auth-footer">
          Don&apos;t have an account?
          <span onClick={() => navigate("/signUp")}>Create one</span>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default Login;
