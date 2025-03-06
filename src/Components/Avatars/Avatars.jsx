/* eslint-disable react/prop-types */
import avatar0 from "./../../assets/Avatar/avatar-0.svg";
import avatar1 from "./../../assets/Avatar/avatar-1.svg";
import avatar2 from "./../../assets/Avatar/avatar-2.svg";
import avatar3 from "./../../assets/Avatar/avatar-3.svg";
import avatar4 from "./../../assets/Avatar/avatar-4.svg";
import avatar5 from "./../../assets/Avatar/avatar-5.svg";
import avatar6 from "./../../assets/Avatar/avatar-6.svg";
import avatar7 from "./../../assets/Avatar/avatar-7.svg";
import avatar8 from "./../../assets/Avatar/avatar-8.svg";
import avatar9 from "./../../assets/Avatar/avatar-9.svg";
import avatar10 from "./../../assets/Avatar/avatar-10.svg";
import avatar11 from "./../../assets/Avatar/avatar-11.svg";
import avatar12 from "./../../assets/Avatar/avatar-12.svg";
import avatar13 from "./../../assets/Avatar/avatar-13.svg";
import avatar14 from "./../../assets/Avatar/avatar-14.svg";
import avatar15 from "./../../assets/Avatar/avatar-15.svg";
import avatar16 from "./../../assets/Avatar/avatar-16.svg";
import avatar17 from "./../../assets/Avatar/avatar-17.svg";
import avatar18 from "./../../assets/Avatar/avatar-18.svg";
import avatar19 from "./../../assets/Avatar/avatar-19.svg";
import "./Avatars.css";
import { motion } from "framer-motion";
const Avatars = ({ setShowAvatar, HandleSetImage }) => {
  const images = [
    avatar0,
    avatar1,
    avatar2,
    avatar3,
    avatar4,
    avatar5,
    avatar6,
    avatar7,
    avatar8,
    avatar9,
    avatar10,
    avatar11,
    avatar12,
    avatar13,
    avatar14,
    avatar15,
    avatar16,
    avatar17,
    avatar18,
    avatar19,
  ];
  return (
    <motion.div
      className="avatars"
    >
      {images.map((img, index) => (
        <img
          key={index}
          src={img}
          alt="Avatar"
          onClick={() => {
            HandleSetImage(`avatar-${index}`)
            setShowAvatar();
          }}
        />
      ))}
    </motion.div>
  );
};

export default Avatars;
