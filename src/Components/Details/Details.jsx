/* eslint-disable react/prop-types */
import "./Details.css";
import fire from "../../assets/fire_icon.svg";
import hand from "../../assets/hand_icon.svg";
import clock from "../../assets/clock_icon.svg";
import map from "../../assets/map_icon.svg";
import eyes from "../../assets/eyes_icon.svg";
import send from "./images/send.svg";
import { MapContainer, Marker, Popup, TileLayer } from "react-leaflet";
import { useContext, useState } from "react";
import { ContextProvider } from "../../context/ContextApi";
import { AnimatePresence, motion } from "framer-motion";
import { API_BASE } from "../../api";

const Details = ({ data, setDetails }) => {
  const [active, setActive] = useState(data?.type);
  const [showImage, setShowImage] = useState(false);
  const [countRespond, setCountRespond] = useState(data.responders.length);
  const { user, UpdatePost, UpdateUser } = useContext(ContextProvider);
  const [createComment, setCreateComment] = useState("");
  const [addRespond, setAddRespond] = useState(0);
  const [commentsArray, setCommentsArray] = useState(data?.comments || []);

  const mapLat = Array.isArray(data.location) && data.location[0] ? +data.location[0] : 51.505;
  const mapLng = Array.isArray(data.location) && data.location[1] ? +data.location[1] : -0.09;

  // ── Handlers ────────────────────────────────────────────────────────────
  const HandleActive = async () => {
    const newType = active === "active" ? "inactive" : "active";
    setActive(newType);
    try {
      const res = await fetch(`${API_BASE}/emergencies/${data._id}`, {
        method: "PATCH", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ type: newType }),
      });
      const json = await res.json();
      if (res.ok) UpdatePost(json.data);
    } catch (e) { console.error(e); }
  };

  const HandlePoint = async () => {
    try {
      const res = await fetch(`${API_BASE}/users/${user._id}`, {
        method: "PATCH", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ point: user.point + 5 }),
      });
      const json = await res.json();
      if (res.ok) UpdateUser(json.data);
    } catch (e) { console.error(e); }
  };

  const HandleRespond = async () => {
    if (addRespond >= 1) return;
    if (data.responders.find((r) => r.userId === user._id)) return;
    setCountRespond(countRespond + 1);
    setAddRespond(1);
    try {
      const res = await fetch(`${API_BASE}/emergencies/${data._id}`, {
        method: "PATCH", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ responders: [...data.responders, { userId: user._id, name: user.name, image: user.image, state: "At the scene" }] }),
      });
      const json = await res.json();
      if (res.ok) { UpdatePost(json.data); HandlePoint(); }
    } catch (e) { setCountRespond(c => c - 1); setAddRespond(0); }
  };

  const HandleCreateComment = async () => {
    if (!createComment.trim()) return;
    const ob = { userId: user._id, image: user.image, name: user.name, content: createComment, createdAt: new Date() };
    try {
      const res = await fetch(`${API_BASE}/emergencies/${data._id}`, {
        method: "PATCH", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ comments: [...data.comments, ob] }),
      });
      const json = await res.json();
      if (res.ok) { UpdatePost(json.data); setCommentsArray(prev => [...prev, ob]); setCreateComment(""); }
    } catch (e) { console.error(e); }
  };

  // ── Level badge style ────────────────────────────────────────────────────
  const levelBadgeClass = { danger: "badge badge-danger", medium: "badge badge-medium", normal: "badge badge-normal" }[data.level] || "badge badge-normal";
  const typeBadgeClass = data.type === "active" ? "badge badge-active" : "badge badge-inactive";

  return (
    <motion.div className="details" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.3 }}>

      {/* Header */}
      <div className="details-header" onClick={() => setDetails(null)}>
        <div className="back-btn">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 384 512">
            <path d="M380.6 81.7c7.9 15.8 1.5 35-14.3 42.9L103.6 256 366.3 387.4c15.8 7.9 22.2 27.1 14.3 42.9s-27.1 22.2-42.9 14.3l-320-160C6.8 279.2 0 268.1 0 256s6.8-23.2 17.7-28.6l320-160c15.8-7.9 35-1.5 42.9 14.3z" />
          </svg>
        </div>
        <h1>Emergency Details</h1>
      </div>

      {/* Hero card */}
      <div className="hero-card">
        <div className="title-row">
          <div className="cat-icon"><img src={fire} alt="" /></div>
          <h2>{data.title}</h2>
        </div>
        <div className="meta-row">
          <span className={typeBadgeClass}>{data.type}</span>
          <span className={levelBadgeClass}>{data.level}</span>
          <span className={`badge ${data.category === "fire" ? "badge-danger" : "badge-medium"}`}>{data.category}</span>
        </div>
        <p className="created-by" style={{ marginTop: "10px" }}>Posted by <strong>{data.createdBy}</strong></p>

        {/* Owner status toggle */}
        {user?._id === data.userId && (
          <div className="status-toggle" style={{ marginTop: "16px" }}>
            <h3>Emergency Status</h3>
            <button className={`toggle ${active === "active" ? "on" : ""}`} onClick={HandleActive}>
              <span />
            </button>
            <span style={{ fontSize: "0.82rem", color: active === "active" ? "var(--red)" : "var(--text-muted)" }}>
              {active === "active" ? "Active" : "Resolved"}
            </span>
          </div>
        )}
      </div>

      {/* Info grid */}
      <div className="info-grid">
        <div className="info-cell">
          <div className="label">Location</div>
          <div className="icon-row">
            <img src={map} alt="" />
            <a href={`https://www.openstreetmap.org/#map=16/${mapLat}/${mapLng}`} target="_blank" rel="noreferrer" className="value">
              View on Map
            </a>
          </div>
        </div>
        <div className="info-cell">
          <div className="label">Time Reported</div>
          <div className="icon-row">
            <img src={clock} alt="" />
            <span className="value">{data.time}</span>
          </div>
        </div>
      </div>

      {/* Description */}
      <div className="description-card">{data.description}</div>

      {/* Map */}
      <div className="map-card">
        <MapContainer className="map" center={[mapLat, mapLng]} zoom={13} scrollWheelZoom={false} key={`${mapLat}-${mapLng}`}>
          <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" attribution='&copy; OpenStreetMap' />
          <Marker position={[mapLat, mapLng]}><Popup>{data.title}</Popup></Marker>
        </MapContainer>
      </div>

      {/* Photo button */}
      <button className="photo-btn" onClick={() => setShowImage(true)}>
        <img src={eyes} alt="" /> See Emergency Photos
      </button>

      {/* Responders count */}
      <div className="responders-count">
        <img src={hand} alt="" />
        <strong>{countRespond}</strong>&nbsp;{countRespond === 1 ? "Responder" : "Responders"}
      </div>

      {/* Respond / Dismiss */}
      {user?._id !== data.userId && data.type !== "inactive" && (
        <div className="respond-bar">
          <button className="btn-respond" onClick={HandleRespond}>
            <svg width="16" height="16" fill="none" viewBox="0 0 16 17" xmlns="http://www.w3.org/2000/svg">
              <path d="M3.66671 13.8334L2.00004 9.00009L1.34722 5.73603C1.33337 5.59613V5.54249C1.33337 5.08576 1.9275 4.90876 2.17746 5.29106L3.53694 8.21896C3.61011 8.37746 3.79317 8.45266 3.95664 8.39136L4.00004 8.37509L3.37641 3.81484C3.34884 3.61318 3.52397 3.24595C3.69484 3.01812 4.01807 2.97195 4.24591 3.14282L5.95637 7.54066C5.98251 7.61613 6.05361 7.66676 6.13347 7.66676C6.24174 7.66676 6.32747 7.57533 6.32051 7.46729L7.19891 2.25918C7.39271 2.41422 7.52194 2.6358 7.56144 2.88082L8.30767 7.50749C8.32247 7.59929 8.40174 7.66676 8.49471 7.66676C8.59227 7.66676 8.67387 7.59266 8.68327 7.49556L9.12601 2.92068C9.28571 2.40488 9.49667 2.23613C9.81287 1.98316 10.1695 2.00291 10.3935 2.22693C10.5684 2.40183 10.6667 2.63905 10.6667 2.8864V9.38953C10.6667 9.65326 10.9584 9.81253 11.1803 9.66993L12.6706 8.71186C12.8857 8.57359 13.136 8.50009 13.3916 8.50009H14.0811C14.3395 8.50009 14.4997 8.78139 14.3677 9.00359L11.5 13.8334C11.5 13.8334 10.3334 15.1668 7.66671 15.1668C5.00004 15.1668 3.88894 14.2779 3.66671 13.8334Z" stroke="#fff" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            Respond to Emergency
          </button>
          <button className="btn-dismiss" onClick={() => setDetails(null)}>Dismiss</button>
        </div>
      )}

      {/* Responders list */}
      {data.responders.length > 0 && (
        <>
          <h2 className="section-heading">Responders</h2>
          <div className="responders-list">
            {data.responders.map((r, i) => (
              <div className="responder" key={i}>
                <div className="resp-avatar">
                  <img src={`/src/assets/Avatar/${r.image}.svg`} alt={r.name} onError={(e) => { e.target.style.display = "none"; }} />
                </div>
                <div className="resp-info">
                  <h3>{r.name}</h3>
                  <p>{r.state}</p>
                </div>
              </div>
            ))}
          </div>
        </>
      )}

      {/* Comments */}
      <h2 className="section-heading">Comments</h2>
      <div className="comments">
        <AnimatePresence>
          {commentsArray.map((c, i) => <Comment key={i} comment={c} />)}
        </AnimatePresence>
      </div>

      {/* Comment input */}
      {data.type === "active" && (
        <div className="comment-form">
          <div className="form-avatar">
            <img src={`/src/assets/Avatar/${user?.image}.svg`} alt="" onError={(e) => { e.target.style.display = "none"; }} />
          </div>
          <input
            type="text" placeholder="Add a comment…"
            value={createComment} onChange={(e) => setCreateComment(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && HandleCreateComment()}
          />
          <button className="send-btn" onClick={HandleCreateComment} type="button">
            <img src={send} alt="Send" />
          </button>
        </div>
      )}

      {/* Image modal */}
      {showImage && (
        <div className="image-modal" onClick={() => setShowImage(false)}>
          <button className="close-btn" onClick={() => setShowImage(false)}>
            <svg viewBox="0 0 1024 1024" xmlns="http://www.w3.org/2000/svg">
              <path d="M195.2 195.2a64 64 0 0 1 90.496 0L512 421.504 738.304 195.2a64 64 0 0 1 90.496 90.496L602.496 512 828.8 738.304a64 64 0 0 1-90.496 90.496L512 602.496 285.696 828.8a64 64 0 0 1-90.496-90.496L421.504 512 195.2 285.696a64 64 0 0 1 0-90.496z" />
            </svg>
          </button>
          <img src={`http://localhost:4000/images/${data._id}/${data.image}`} alt={data.title} onClick={(e) => e.stopPropagation()} />
        </div>
      )}
    </motion.div>
  );
};

export default Details;

const Comment = ({ comment }) => (
  <motion.div
    className="comment"
    initial={{ opacity: 0, y: 10 }}
    animate={{ opacity: 1, y: 0 }}
    exit={{ opacity: 0, scale: 0.95 }}
  >
    <div className="comment-avatar">
      <img src={`/src/assets/Avatar/${comment.image}.svg`} alt="" onError={(e) => { e.target.style.display = "none"; }} />
    </div>
    <div className="comment-body">
      <h2>{comment.name}</h2>
      <p className="comment-text">{comment.content}</p>
      <p className="comment-time">{new Date(comment.createdAt).toLocaleTimeString()}</p>
    </div>
  </motion.div>
);
