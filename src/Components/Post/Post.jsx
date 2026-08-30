import "./Post.css";
import location from "../../assets/location_icon.svg";
import file_icon from "../../assets/file_icon.svg";
import { useContext, useEffect, useRef, useState } from "react";
import { ContextProvider } from "./../../context/ContextApi";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { motion } from "framer-motion";
import { API_BASE } from "../../api";

function useGeolocation() {
  const [isLoading, setIsLoading] = useState(false);
  const [position, setPosition] = useState({});
  const getPosition = () => {
    if (!navigator.geolocation) return;
    setIsLoading(true);
    navigator.geolocation.getCurrentPosition(
      (pos) => { setPosition({ lat: pos.coords.latitude, lng: pos.coords.longitude }); setIsLoading(false); },
      () => setIsLoading(false)
    );
  };
  return { isLoading, position, getPosition };
}

const Post = () => {
  const { AddPost, user } = useContext(ContextProvider);
  const { isLoading, position: { lat, lng }, getPosition } = useGeolocation();
  const hasFetched = useRef(false);
  const [formData, setFormData] = useState({
    title: "", category: "fire", level: "normal", description: "",
    responders: [], comments: [], type: "active", image: "", time: "",
    createdBy: user?.name || "", userId: user?._id || "",
  });
  const [file, setFile] = useState(null);
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (!hasFetched.current) { hasFetched.current = true; getPosition(); }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const HandleUpload = async (emergencyId) => {
    if (!file) return;
    const fd = new FormData();
    fd.append("file", file);
    try { await axios.post(`${API_BASE}/upload/${emergencyId}`, fd); } catch (e) { console.error(e); }
  };

  const FetchEmergencies = async () => {
    setLoading(true);
    const body = {
      ...formData,
      image: file ? file.name : "",
      location: [lat ?? 0, lng ?? 0],
      time: new Date().toLocaleTimeString(),
    };
    try {
      const response = await fetch(`${API_BASE}/emergencies`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      const json = await response.json();
      if (response.ok) {
        await HandleUpload(json.data._id);
        AddPost(json.data);
        navigate("/");
      } else {
        setError(json.message || "Failed to post emergency");
      }
    } catch {
      setError("Network error — please try again");
    } finally {
      setLoading(false);
    }
  };

  const HandleInput = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const HandleSubmit = () => {
    if (!formData.title || !formData.description || !file) {
      setError("Please fill in all fields and upload a photo.");
      return;
    }
    setError(false);
    FetchEmergencies();
  };

  return (
    <motion.div
      className="post"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      <div className="page-header">
        <h1>Post Emergency</h1>
        <p>Report an emergency to alert nearby responders immediately</p>
      </div>

      <div className="post-card">
        <form onSubmit={(e) => { e.preventDefault(); HandleSubmit(); }}>

          <div className="form-input-group">
            <label>Title</label>
            <input type="text" name="title" placeholder="Brief description of the emergency" value={formData.title} onChange={HandleInput} />
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
            <div className="form-input-group">
              <label>Category</label>
              <select name="category" value={formData.category} onChange={HandleInput}>
                <option value="fire">🔥 Fire</option>
                <option value="electric">⚡ Electric</option>
                <option value="medical">🏥 Medical</option>
                <option value="flood">🌊 Flood</option>
                <option value="accident">🚗 Accident</option>
                <option value="other">⚠️ Other</option>
              </select>
            </div>
            <div className="form-input-group">
              <label>Severity Level</label>
              <select name="level" value={formData.level} onChange={HandleInput}>
                <option value="normal">🟢 Normal</option>
                <option value="medium">🟡 Medium</option>
                <option value="danger">🔴 Danger</option>
              </select>
            </div>
          </div>

          <div className="form-input-group">
            <label>Description</label>
            <textarea name="description" placeholder="Describe what's happening, who's affected, and what help is needed…" value={formData.description} onChange={HandleInput} />
          </div>

          {/* Action buttons */}
          <div className="action-row">
            <label className={`file-upload-btn ${file ? "has-file" : ""}`}>
              <img src={file_icon} alt="" />
              {file ? `${file.name} ✓` : "Upload Photo"}
              <input type="file" accept="image/*" onChange={(e) => setFile(e.target.files[0])} />
            </label>

            <button
              type="button"
              className={`location-btn ${lat ? "located" : ""}`}
              onClick={getPosition}
              disabled={isLoading}
            >
              <img src={location} alt="" />
              {isLoading ? "Getting location…" : lat ? "Location captured ✓" : "Add Location"}
            </button>
          </div>

          {error && <div className="error-msg">{error}</div>}

          <button className="submit-btn" type="submit" disabled={loading}>
            {loading ? "Submitting…" : "🚨 Submit Emergency"}
          </button>
        </form>
      </div>
    </motion.div>
  );
};

export default Post;
