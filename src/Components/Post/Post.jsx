import "./Post.css";
import location from "../../assets/location_icon.svg";
import file_icon from "../../assets/file_icon.svg";
import { useContext, useEffect, useState } from "react";
import { ContextProvider } from "./../../context/ContextApi";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { motion } from "framer-motion";

function useGeolocation() {
  const [isLoading, setIsLoading] = useState(false);
  const [position, setPosition] = useState({});
  const [error, setError] = useState(null);

  function getPosition() {
    if (!navigator.geolocation)
      return setError("Your browser does not support geolocation");

    setIsLoading(true);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setPosition({
          lat: pos.coords.latitude,
          lng: pos.coords.longitude,
        });
        setIsLoading(false);
      },
      (error) => {
        setError(error.message);
        setIsLoading(false);
      }
    );
  }

  return { isLoading, position, error, getPosition };
}

const Post = () => {
  const { AddPost, user } = useContext(ContextProvider);
  const {
    isLoading,
    position: { lat, lng },
    getPosition,
  } = useGeolocation();
  const [formData, setFormData] = useState({
    title: "",
    category: "Fire",
    level: "Normal",
    description: "",
    location: [lat, lng],
    responders: [],
    type: "active",
    image: "",
    time: "",
    createdBy: user.name,
    userId: user._id,
  });
  const [file, setFile] = useState(null);
  const HandleUpload = async (id) => {
    const formdata = new FormData();
    formdata.append("file", file);
    axios
      .post(`http://localhost:4000/api/v1/upload/${id}`, formdata)
      .then(() => navigate("/"))
      .catch((err) => console.log(err));
  };

  const [error, setError] = useState(false);
  const navigate = useNavigate();

  const FetchEmergencies = async () => {
    const response = await fetch("http://localhost:4000/api/v1/emergencies", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        ...formData,
        user_phone: user.phone,
        location: [lat, lng],
        time: new Date().toLocaleTimeString(),
      }),
    });
    const json = await response.json();
    if (response.ok) {
      FetchSMS()
      HandleUpload(json.data._id);
      AddPost(json.data);
      navigate("/");
    } else {
      throw new Error("Failed to fetch notes");
    }
  };
  const FetchSMS = async () => {
    const response = await fetch("http://127.0.0.1:4000/api/v1/sms/send-sms");
    const json = await response.json();
    if (response.ok) {
      console.log(json);
    } else {
      throw new Error("Failed to fetch notes");
    }
  };


  const HandleInput = (e) => {
    const name = e.target.name;
    const value = e.target.value;
    setFormData({ ...formData, [name]: value });
  };

  const HandleSubmit = () => {
    if (
      formData.title === "" ||
      formData.category === "" ||
      formData.level === "" ||
      formData.description === "" ||
      formData.location === "" ||
      !file
    ) {
      setError(
        "fill all the fields with a message and close the form when you click"
      );
    } else {
      setError(false);
      setFormData({ ...formData, image: file.name });
      console.log(formData);
      FetchEmergencies();
      // AddPost(formData)
    }
  };

  function handleClick() {
    getPosition();
  }
  useEffect(() => {
    getPosition();
  }, [getPosition]);
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
      className="post"
    >
      <h1 className="title">Post Emergency</h1>
      <form
        action="#"
        onSubmit={(e) => {
          e.preventDefault();
          HandleSubmit();
        }}
      >
        <div className="input">
          <label htmlFor="title">Title</label>
          <input
            type="text"
            name="title"
            // placeholder="Enter Title ..."
            value={formData.title}
            onChange={(e) => HandleInput(e)}
          />
        </div>

        <div className="input">
          <label htmlFor="category">Category</label>
          <select
            name="category"
            id=""
            value={formData.category}
            onChange={(e) => HandleInput(e)}
          >
            <option value="fire">Fire</option>
            <option value="electric">Electric</option>
          </select>
        </div>

        <div className="input">
          <label htmlFor="level">Level</label>
          <select
            name="level"
            id=""
            value={formData.level}
            onChange={(e) => HandleInput(e)}
          >
            <option value="normal">Normal</option>
            <option value="medium">Medium</option>
            <option value="danger">Danger</option>
          </select>
        </div>

        <div className="input">
          <label htmlFor="description">Description</label>
          <textarea
            type="text"
            name="description"
            // placeholder="Enter Description ..."
            value={formData.description}
            onChange={(e) => HandleInput(e)}
          />
        </div>

        <div className="btn">
          <div className="file-upload">
            <img src={file_icon} alt="" />
            <input
              type="file"
              // name="image"
              id="upload"
              // value={formData.image}
              onChange={(e) => setFile(e.target.files[0])}
            />
            <label htmlFor="upload">Upload Photo</label>
          </div>
          <button onClick={handleClick} disabled={isLoading}>
            <img src={location} alt="" />
            Add Location
          </button>
        </div>
        {/* 
        {isLoading && <p>Loading position...</p>}
        {l_error && <p>{l_error}</p>}
        {!isLoading && !error && lat && lng && (
          <p>
            Your GPS position:{" "}
            <a
              target="_blank"
              rel="noreferrer"
              href={`https://www.openstreetmap.org/#map=16/${lat}/${lng}`}
            >
              {lat}, {lng}
            </a>
          </p>
        )} */}

        {/* <div className="check">
          <input type="checkbox" name="" id="check1" />
          <label htmlFor="check1">Include my Contact information</label>
        </div>
        <div className="check">
          <input type="checkbox" name="" id="check2" />
          <label htmlFor="check2">I accept the terms and conditions</label>
        </div> */}
        {error && <p className="error">{error}</p>}
        <button className="submit" type="submit">
          Submit Emergency
        </button>
      </form>
    </motion.section>
  );
};

export default Post;
