import "./SignUp.css";
import eye1 from "../../assets/eye1.svg";
import eye2 from "../../assets/eye2.svg";
import file_icon from "../../assets/file_icon.svg";
import Otp from "../Otp/Otp";
import { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { motion } from "framer-motion";
import Avatars from "../Avatars/Avatars";
import { ContextProvider } from "../../context/ContextApi";
import { API_BASE } from "../../api";

const SignUp = () => {
  const { UpdateToken, UpdateUser } = useContext(ContextProvider);
  const [showOtp, setShowOtp] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showPasswordConfirm, setShowPasswordConfirm] = useState(false);
  const [showAvatar, setShowAvatar] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: "", email: "", password: "", confirmPassword: "", phone: "", image: "",
  });
  const [error, setError] = useState(false);
  const navigate = useNavigate();

  const SubmitUserInfo = async () => {
    setLoading(true);
    try {
      const { confirmPassword, ...payload } = formData;
      const response = await axios.post(`${API_BASE}/users`, payload);
      const json = response.data;
      if (json?.data) {
        UpdateToken(json.data._id);
        UpdateUser(json.data);
        navigate("/");
      }
    } catch (err) {
      setError(err.response?.data?.message || "Registration failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const HandleInput = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const HandleSubmit = () => {
    if (!formData.name || !formData.email || !formData.password || !formData.confirmPassword || !formData.phone || !formData.image) {
      setError("Please fill in all fields and choose a profile image.");
      return;
    }
    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match.");
      return;
    }
    setError(false);
    SubmitUserInfo();
  };

  const HandleSetImage = (imageName) => {
    setFormData({ ...formData, image: imageName });
    setShowAvatar(false);
  };

  return showOtp ? (
    <Otp HandleSubmit={SubmitUserInfo} setShowOtp={() => setShowOtp(false)} />
  ) : (
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
        <div className="brand">
          <span className="dot" />
          <h2>1stResponse</h2>
        </div>

        <div className="auth-header">
          <h1>Create Account</h1>
          <p>Join the community of emergency responders</p>
        </div>

        <form onSubmit={(e) => { e.preventDefault(); HandleSubmit(); }}>
          <div className="auth-input-group">
            <label>Full Name</label>
            <input type="text" name="name" placeholder="John Doe" value={formData.name} onChange={HandleInput} />
          </div>

          <div className="auth-input-group">
            <label>Email Address</label>
            <input type="email" name="email" placeholder="you@example.com" value={formData.email} onChange={HandleInput} />
          </div>

          <div className="auth-input-group">
            <label>Password</label>
            <input
              type={showPassword ? "text" : "password"}
              name="password" placeholder="••••••••"
              value={formData.password} onChange={HandleInput}
            />
            <img className="eye-toggle" src={showPassword ? eye2 : eye1} onClick={() => setShowPassword(!showPassword)} alt="" />
          </div>

          <div className="auth-input-group">
            <label>Confirm Password</label>
            <input
              type={showPasswordConfirm ? "text" : "password"}
              name="confirmPassword" placeholder="••••••••"
              value={formData.confirmPassword} onChange={HandleInput}
            />
            <img className="eye-toggle" src={showPasswordConfirm ? eye2 : eye1} onClick={() => setShowPasswordConfirm(!showPasswordConfirm)} alt="" />
          </div>

          <div className="auth-input-group">
            <label>Phone Number</label>
            <input type="number" name="phone" placeholder="+1 234 567 8900" value={formData.phone} onChange={HandleInput} />
          </div>

          {/* Avatar picker */}
          <div
            className={`avatar-picker-btn ${formData.image ? "selected" : ""}`}
            onClick={() => setShowAvatar(true)}
          >
            <img src={file_icon} alt="" />
            {formData.image ? `Profile: ${formData.image} ✓` : "Choose Profile Avatar"}
          </div>

          {error && <div className="error-msg">{error}</div>}

          <button className="auth-submit" type="submit" disabled={loading}>
            {loading ? "Creating account…" : "Create Account"}
          </button>
        </form>

        <div className="auth-footer">
          Already have an account?
          <span onClick={() => navigate("/login")}>Sign in</span>
        </div>
      </motion.div>

      {showAvatar && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="box_avatars"
          onClick={(e) => e.target === e.currentTarget && setShowAvatar(false)}
        >
          <Avatars setShowAvatar={() => setShowAvatar(false)} HandleSetImage={HandleSetImage} />
        </motion.div>
      )}
    </motion.div>
  );
};

export default SignUp;
