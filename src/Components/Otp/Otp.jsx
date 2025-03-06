/* eslint-disable react/prop-types */
import { motion } from "framer-motion";
import "./Otp.css";
import { useState } from "react";
const Otp = ({ setShowOtp, HandleSubmit }) => {
  const [otp, setOtp] = useState(new Array(4).fill(""));
  const [error, setError] = useState(null);

  const HandleChange = (e, index) => {
    if (isNaN(e.target.value) || e.target.value == "") return false;
    setOtp([
      ...otp.map((data, indx) => (index === indx ? e.target.value : data)),
    ]);
    if (e.target.value && e.target.nextSibling) {
      e.target.nextSibling.focus();
    }
  };
  const HandleSubmitOtp = () => {
    const otp_code = otp.join("");
    if (otp_code === "1234") {
      setError(null);
      HandleSubmit();
    } else {
      setError("Invalid OTP Try Again .");
      otp[0].focus();
    }
    setOtp(new Array(4).fill(""));
  };
  const HandlePre = (e, index) => {
    setOtp([...otp.map((data, indx) => (index === indx ? "" : data))]);
    if (e.target.previousSibling) {
      e.target.previousSibling.focus();
    }
  };
  return (
    
    <motion.div 
    initial={{opacity: 0,scale: 0}}
    animate={{opacity: 1,scale: 1}}
    className="otp">
      <div className="back" onClick={() => setShowOtp()}>
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 384 512">
          <path d="M380.6 81.7c7.9 15.8 1.5 35-14.3 42.9L103.6 256 366.3 387.4c15.8 7.9 22.2 27.1 14.3 42.9s-27.1 22.2-42.9 14.3l-320-160C6.8 279.2 0 268.1 0 256s6.8-23.2 17.7-28.6l320-160c15.8-7.9 35-1.5 42.9 14.3z" />
        </svg>
      </div>
      <div className="title">
        <h1>Sign up</h1>
        <h1>Verify OTP</h1>
        <p>Please enter the code we sent you to email</p>
      </div>
      <div className="input">
        {otp.map((data, index) => {
          return (
            <input
              key={index}
              value={data}
              type="text"
              maxLength={1}
              onChange={(e) => HandleChange(e, index)}
              onKeyDown={(e) => {
                if (e.key === "Backspace") {
                  HandlePre(e, index);
                }
              }}
            />
          );
        })}
      </div>
      <div className="info">
        Didn’t Receive OTP ? <span>Resend Code</span>
      </div>

      {error && <p className="error">{error}</p>}
      <button onClick={() => HandleSubmitOtp()}>Verify</button>
    </motion.div>
  );
};

export default Otp;
