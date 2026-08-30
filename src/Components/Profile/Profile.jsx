/* eslint-disable react/prop-types */
import accountIcon from "../../assets/account_icon.svg";
import settingsIcon from "../../assets/settings.svg";
import "./Profile.css";
import Emergence from "../Emergence/Emergence";
import { useContext, useEffect, useState } from "react";
import Settings from "../Settings/Settings";
import Edit from "../Edit/Edit";
import { ContextProvider } from "./../../context/ContextApi";
import { API_BASE } from "../../api";
import { motion } from "framer-motion";

const Profile = () => {
  const [edit, setEdit] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [users, setUsers] = useState([]);
  const { user } = useContext(ContextProvider);
  const yourRanking = users.findIndex((ele) => ele.name === user?.name);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await fetch(`${API_BASE}/users/top`);
        const json = await res.json();
        if (res.ok) setUsers(json.data);
      } catch (e) { console.error(e); }
    };
    fetchUsers();
  }, [user]);

  if (edit) return <Edit setEdit={() => setEdit(false)} />;
  if (showSettings) return <Settings setSettings={() => setShowSettings(false)} />;
  return <ProfileMain setEdit={() => setEdit(true)} setSettings={() => setShowSettings(true)} yourRanking={yourRanking} />;
};

export default Profile;

const ProfileMain = ({ setEdit, setSettings, yourRanking }) => {
  const [post, setPost] = useState([]);
  const [response, setResponse] = useState([]);
  const { user, data } = useContext(ContextProvider);

  useEffect(() => {
    if (!user) return;
    setPost(data.filter((e) => e.userId === user._id));
    const res = [];
    data.forEach((e) => e.responders.forEach((r) => { if (r.userId === user._id) res.push(e); }));
    setResponse(res);
  }, [data, user]);

  const rankDisplay = yourRanking >= 0 ? yourRanking + 1 : "—";
  const isTopRank = yourRanking >= 0 && yourRanking < 3;

  return (
    <motion.section className="profile" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.35 }}>

      {/* Hero */}
      <div className="profile-hero">
        <div className="avatar">
          <img src={`/src/assets/Avatar/${user?.image}.svg`} alt={user?.name} onError={(e) => { e.target.style.display = "none"; }} />
        </div>
        <div className="info">
          <h1>{user?.name}</h1>
          <p>Emergency Responder</p>
          <div className="hero-btns">
            <button className="btn-edit" onClick={setEdit}>
              <img src={accountIcon} alt="" />
              Edit Profile
            </button>
            <button className="btn-settings" onClick={setSettings}>
              <img src={settingsIcon} alt="" style={{ filter: "none" }} />
              Settings
            </button>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="stats-strip">
        <div className="stat-card">
          <h3>Total Responses</h3>
          <h1>{response.length}</h1>
        </div>
        <div className="stat-card">
          <h3>Posts</h3>
          <h1>{post.length}</h1>
        </div>
        <div className="stat-card">
          <h3>Points Earned</h3>
          <h1>{user?.point ?? 0}</h1>
        </div>
        <div className="stat-card ranking">
          <h3>Ranking</h3>
          <h1 className={isTopRank ? "top" : ""}>{rankDisplay}</h1>
        </div>
      </div>

      {/* Post history */}
      <div className="history-section">
        <h2>Post History</h2>
        {post.length > 0 ? (
          <div className="cards">
            {post.map((item, i) => <Emergence key={i} data={item} status={item.type} />)}
          </div>
        ) : <p className="empty">No emergencies posted yet.</p>}
      </div>

      {/* Response history */}
      <div className="history-section">
        <h2>Response History</h2>
        {response.length > 0 ? (
          <div className="cards">
            {response.map((item, i) => <Emergence key={i} data={item} status={item.type} />)}
          </div>
        ) : <p className="empty">No emergencies responded to yet.</p>}
      </div>

    </motion.section>
  );
};
