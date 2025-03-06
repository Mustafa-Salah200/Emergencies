/* eslint-disable react/prop-types */
import heart from "../../assets/heart_rate.svg";
import swimming from "../../assets/swimming.svg";
import hospital from "../../assets/hospital.svg";
import house from "../../assets/house_fire.svg";
import award from "../../assets/award_icon.svg";
import "./Learn.css";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";

const Learn = () => {
  return (
    <motion.section className="learn">
      <h1 className="title">Learn</h1>
      <div className="guides">
        <h2>Quick Access Guides</h2>
        <div className="content">
          <GuideBox image={heart} title="CPR Basics" min={10} delay="0" />
          <GuideBox image={house} title="Fire Basics" min={10} delay="0.3" />
          <GuideBox
            image={hospital}
            title="Emergency Kits"
            min={10}
            delay="0.5"
          />
          <GuideBox
            image={swimming}
            title="Water Rescue"
            min={10}
            delay="0.7"
          />
        </div>
      </div>

      <div className="feature">
        <h2>Featured Courses</h2>
        <div className="content">
          <FeatureBox title="Emergency Preparedness" rate="0" text="Start" />
          <FeatureBox title="First Aid  Basics" rate="70" text="Continue" />
        </div>
      </div>
      <div className="Certificates">
        <h2>Certificates</h2>
        <div className="content">
          <CertificateBox
            title="Basic Life Support"
            info="Completed on December, 15, 2024"
          />
          <CertificateBox
            title="Panic Control"
            info="Completed on October, 17, 2024"
          />
        </div>
      </div>
    </motion.section>
  );
};

export default Learn;

const GuideBox = ({ image, title, min, delay }) => {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay: delay, duration: 0.4 }}
      className="guideBox"
    >
      <div className="top">
        <img src={image} alt="" />
        <div className="info">
          <h4>{title}</h4>
          <p>{min} Min</p>
        </div>
      </div>
      <button>View Guide</button>
    </motion.div>
  );
};

const FeatureBox = ({ title, rate, text }) => {
  const [color, setColor] = useState(null);
  rate = rate * 1;
  useEffect(() => {
    if (rate <= 100 && rate >= 70) {
      setColor("#0BDB11");
    } else if (rate < 70 && rate >= 20) {
      setColor("#FFC107");
    } else if (rate < 20 && rate >= 0) {
      setColor("#E51B1B");
    }
  }, []);
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0 }}
      whileInView={{ scale: 1, opacity: 1 }}
      transition={{ duration: 0.4 }}
      className="featureBox"
    >
      <div className="top">
        <h4>{title}</h4>
        <span
          style={{
            color: color,
          }}
        >
          {rate} %
        </span>
      </div>
      <div className="rate">
        <motion.span
        initial={{width: 0}}
        animate={{width: `${rate}%`}}
        transition={{ duration: 2 }}
          style={{
            borderRadius: "10px"
          }}
        ></motion.span>
      </div>
      <button>{text}</button>
    </motion.div>
  );
};

const CertificateBox = ({ title, info }) => {
  return (
    <motion.div
    initial={{ opacity: 0, scale: 0 }}
    whileInView={{ scale: 1, opacity: 1 }}
    transition={{ duration: 0.4 }}
    className="certificateBox">
      <div className="image">
        <img src={award} alt="" />
      </div>
      <div className="info">
        <h3>{title}</h3>
        <p>{info}</p>
      </div>
    </motion.div>
  );
};
