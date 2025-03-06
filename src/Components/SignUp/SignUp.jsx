import "./SignUp.css";
// import facebook from "../../assets/facebook3.svg";
// import apple from "../../assets/apple_icon.svg";
// import google from "../../assets/google3.svg";

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

const SignUp = () => {
  const {UpdateToken, UpdateUser}= useContext(ContextProvider)
  const [showOtp, setShowOtp] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showPasswordConfirm, setShowPasswordConfirm] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    phone: "",
    image: "",
  });
  const [showAvatar, setShowAvatar] = useState(false);
  const [error, setError] = useState(false);
  const navigate = useNavigate();

  const SubmitUserInfo = async () => {
    try {
      const responose = await axios.post(
        "http://localhost:4000/api/v1/users",
        formData
      );
      const json = responose.data;
      if(json){
        console.log(json)
        UpdateToken(json.token)
        UpdateUser(json.data)
        navigate('/')
      }
    } catch (err) {
      console.error("❤️‍🔥 Error ", err);
    }
  };
  const HandleInput = (e) => {
    const name = e.target.name;
    const value = e.target.value;
    setFormData({ ...formData, [name]: value });
  };

  const HandleSubmit = () => {
    if (
      formData.name === "" ||
      formData.email === "" ||
      formData.password === "" ||
      formData.confirmPassword === "" ||
      formData.phone === "" ||
      formData.image === ""
    ) {
      setError(
        "fill all the fields with a message and close the form when you click"
      );
    } else {
      if (formData.password !== formData.confirmPassword) {
        setError("The password must be the same as ConfirmPassword");
      } else {
        setError(false);
        SubmitUserInfo();
      }
    }
  };
  const HandleSetImage = (imageName) => {
    console.log(imageName);
    setFormData({ ...formData, image: imageName });
  };
  return showOtp ? (
    <Otp HandleSubmit={SubmitUserInfo} setShowOtp={() => setShowOtp(false)} />
  ) : (
    <motion.section
      initial={{ scale: 1.4, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{
        duration: 0.6,
        type: "spring",
        damping: 13,
        stiffness: 200,
      }}
      className="signUp"
    >
      <div className="title">
        <h1>Create Account</h1>
        <h1>
          Fill your information below or register with your social account
        </h1>
      </div>

      <form
        action="#"
        onSubmit={(e) => {
          e.preventDefault();
          HandleSubmit(e);
        }}
      >
        <div className="input">
          <label htmlFor="email">Name</label>
          <input
            id="name"
            type="text"
            name="name"
            value={formData.name}
            onChange={(e) => HandleInput(e)}
          />
        </div>

        <div className="input">
          <label htmlFor="email">Email Address</label>
          <input
            id="email"
            type="email"
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
              setShowPassword(!showPassword);
            }}
            alt=""
          />
        </div>

        <div className="input">
          <label htmlFor="password2">Confirm Password</label>
          <input
            id="password2"
            type={showPasswordConfirm ? "text" : "password"}
            placeholder=""
            name="confirmPassword"
            value={formData.confirmPassword}
            onChange={(e) => HandleInput(e)}
          />
          <img
            className="showPassword"
            src={showPasswordConfirm ? eye2 : eye1}
            onClick={() => {
              setShowPasswordConfirm(!showPasswordConfirm);
            }}
            alt=""
          />
        </div>

        <div className="input">
          <label htmlFor="number">Phone</label>
          <input
            id="number"
            type="number"
            placeholder=""
            name="phone"
            value={formData.phone}
            onChange={(e) => HandleInput(e)}
          />
        </div>
        <div className="file-upload" onClick={() => setShowAvatar(true)}>
          <img src={file_icon} alt="" />
          {/* <input
            type="file"
            id="upload"
            onChange={(e) => setFile(e.target.files[0])}
          /> */}
          <label htmlFor="upload">Profile Image</label>
        </div>
        {error && <p className="error">{error}</p>}
        <button type="submit">Sign Up</button>
        <p className="haveAcount" onClick={() => navigate("/login")}>
          I&apos;m already have an account. <span>login</span>
        </p>
      </form>

      {showAvatar && (
        <motion.div
          initial={{ opacity: 0, scale: 0 }}
          animate={{ opacity: 1, scale: 1 }}
          className="box_avatars"
        >
          <Avatars
            setShowAvatar={() => setShowAvatar(!showAvatar)}
            HandleSetImage={HandleSetImage}
          />
        </motion.div>
      )}
    </motion.section>
  );
};

export default SignUp;
