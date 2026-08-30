/* eslint-disable react/prop-types */
import "./Community.css";
import one from "../../assets/one.svg";
import two from "../../assets/two.svg";
import three from "../../assets/three.svg";
import { useContext, useEffect, useState } from "react";
import { ContextProvider } from "../../context/ContextApi";
import { API_BASE } from "../../api";
import { motion } from "framer-motion";

const MEDAL = { 1: one, 2: two, 3: three };
const RANK_CLASS = { 1: "rank-1", 2: "rank-2", 3: "rank-3" };

const Community = () => {
  const [users, setUsers] = useState([]);
  const { user } = useContext(ContextProvider);
  const yourRankingIndex = users.findIndex((ele) => ele.name === user?.name);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await fetch(`${API_BASE}/users/top`);
        const json = await res.json();
        if (res.ok) setUsers(json.data);
      } catch (e) { console.error(e); }
    };
    fetchUsers();
  }, []);

  return (
    <motion.section className="community" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.35 }}>

      <div className="page-header">
        <h1>Community</h1>
        <p>See how you rank among fellow emergency responders</p>
      </div>

      {/* Top 3 leaderboard */}
      <div className="podium-section">
        <h2>🏆 Top Responders</h2>
        <div className="leaderBoard">
          {users.slice(0, 5).map((ele, index) => (
            <LeaderboardCard key={ele._id || ele.name} data={ele} rank={index + 1} />
          ))}
        </div>
      </div>

      {/* Your position */}
      <div className="your-rank-section">
        <h2>📍 Your Ranking</h2>
        {yourRankingIndex >= 0 ? (
          <LeaderboardCard data={users[yourRankingIndex]} rank={yourRankingIndex + 1} isYou />
        ) : (
          <p style={{ color: "var(--text-muted)", fontSize: "0.9rem" }}>
            Respond to emergencies to earn points and appear on the leaderboard!
          </p>
        )}
      </div>

    </motion.section>
  );
};

export default Community;

const LeaderboardCard = ({ data, rank, isYou }) => {
  if (!data) return null;
  return (
    <div className={`lb-card ${RANK_CLASS[rank] || ""} ${isYou ? "your-rank-card" : ""}`}>
      <div className="rank-num">#{rank}</div>
      <div className="lb-avatar">
        <img src={`/src/assets/Avatar/${data.image}.svg`} alt={data.name} onError={(e) => { e.target.style.display = "none"; }} />
      </div>
      <div className="lb-info">
        <h3>{data.name} {isYou && <span style={{ color: "var(--red)", fontSize: "0.75rem" }}>(You)</span>}</h3>
        <p>Community Responder</p>
      </div>
      {MEDAL[rank] && (
        <div className="medal">
          <img src={MEDAL[rank]} alt={`Rank ${rank} medal`} />
        </div>
      )}
      <div className="points-chip">{data.point ?? 0} pts</div>
    </div>
  );
};
