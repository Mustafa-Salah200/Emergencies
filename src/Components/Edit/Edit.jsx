/* eslint-disable react/prop-types */
import { useContext, useState } from "react";
import "./Edit.css";
import { ContextProvider } from "../../context/ContextApi";
import file_icon from "../../assets/file_icon.svg";
import back from "./images/back.svg";
import axios from "axios";
import { API_BASE } from "../../api";

const Edit = ({ setEdit }) => {
  const { user, UpdateUser } = useContext(ContextProvider);
  const [error, setError] = useState(null);
  const [formData, setFormData] = useState({
    name: user.name,
    email: user.email,
    phone: user.phone,
  });

  const HandleInput = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  // Upload photo then update the user's image field in DB
  const HandleUpload = async (file) => {
    const formdata = new FormData();
    formdata.append("file", file);
    try {
      await axios.post(`${API_BASE}/upload/${user._id}`, formdata);
      await UpdateImageField(file.name);
    } catch (err) {
      console.error("Upload failed:", err);
      setError("Photo upload failed. Please try again.");
    }
  };

  const UpdateImageField = async (imageName) => {
    try {
      const response = await fetch(`${API_BASE}/users/${user._id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ image: imageName }),
      });
      const json = await response.json();
      if (response.ok) {
        UpdateUser(json.data);
      } else {
        setError("Failed to update profile image.");
      }
    } catch (err) {
      console.error(err);
      setError("Failed to update profile image.");
    }
  };

  const UpdateUserInfo = async () => {
    try {
      const response = await fetch(`${API_BASE}/users/${user._id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      const json = await response.json();
      if (response.ok) {
        UpdateUser(json.data);
        setError(null);
        setEdit();
      } else {
        // Safely extract duplicate key error message
        if (json.message && typeof json.message === "object" && json.message.keyPattern) {
          const keys = Object.keys(json.message.keyPattern);
          setError(`The field "${keys[0]}" is already taken — try another`);
        } else {
          setError(json.message || "Update failed. Please try again.");
        }
      }
    } catch (err) {
      console.error(err);
      setError("Network error. Please try again.");
    }
  };

  const HandleSubmit = () => {
    if (formData.name === "" || formData.email === "") {
      setError("Name and email cannot be empty.");
      return;
    }
    UpdateUserInfo();
  };

  return (
    <div className="edit">
      <div className="title">
        <div className="back" onClick={setEdit}>
          <img src={back} alt="Back" />
        </div>
        <h2>Edit Profile</h2>
      </div>

      <div className="image">
        <img
          src={`/src/assets/Avatar/${user.image}.svg`}
          alt={user.name}
          onError={(e) => { e.target.style.display = "none"; }}
        />
        <div className="file-upload">
          <input
            type="file"
            id="upload"
            accept="image/*"
            onChange={(e) => {
              if (e.target.files[0]) HandleUpload(e.target.files[0]);
            }}
          />
          <label htmlFor="upload">
            <img src={file_icon} alt="Upload" />
          </label>
        </div>
      </div>

      <div className="form">
        <div className="input">
          <label htmlFor="name">Name</label>
          <input
            id="name"
            type="text"
            name="name"
            defaultValue={formData.name}
            onChange={HandleInput}
          />
        </div>
        <div className="input">
          <label htmlFor="email">Email</label>
          <input
            id="email"
            type="email"
            name="email"
            defaultValue={formData.email}
            onChange={HandleInput}
          />
        </div>
        <div className="input">
          <label htmlFor="phone">Phone</label>
          <input
            id="phone"
            type="text"
            name="phone"
            defaultValue={formData.phone}
            onChange={HandleInput}
          />
        </div>

        {error && <p className="error">{error}</p>}
        <button onClick={HandleSubmit}>Update</button>
      </div>
    </div>
  );
};

export default Edit;
