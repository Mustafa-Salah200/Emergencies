import { useContext, useState } from "react";
import "./Emergencies.css";
import Emergence from "../Emergence/Emergence";
import Details from "../Details/Details";
import { ContextProvider } from "../../context/ContextApi";
import { AnimatePresence } from "framer-motion";

const Emergencies = () => {
  const [active, setActive] = useState(true);
  const [details, setDetails] = useState(null);
  const { data } = useContext(ContextProvider);

  const filtered = data ? data.filter((e) => (active ? e.type === "active" : e.type !== "active")) : [];

  return details ? (
    <Details data={details} setDetails={setDetails} />
  ) : (
    <section className="emergencies">
      {/* Header */}
      <div className="page-header">
        <h1>Emergencies</h1>
        {active && (
          <div className="live-badge">LIVE</div>
        )}
      </div>

      {/* Tab switcher */}
      <div className="top_nav">
        <h4
          className={active ? "tab-active" : ""}
          onClick={() => setActive(true)}
        >
          Active
        </h4>
        <h4
          className={!active ? "tab-active" : ""}
          onClick={() => setActive(false)}
        >
          Resolved
        </h4>
      </div>

      {/* Cards */}
      <div className="content">
        <div className="box">
          <AnimatePresence>
            {filtered.map((ele) => (
              <Emergence
                key={ele._id}
                data={ele}
                status={ele.type}
                setDetails={() => setDetails(ele)}
              />
            ))}
          </AnimatePresence>
        </div>

        {/* Empty state */}
        {filtered.length === 0 && (
          <div className="empty-state">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
            </svg>
            <h3>{active ? "No active emergencies" : "No resolved emergencies"}</h3>
            <p>{active ? "All clear! No emergencies reported right now." : "Resolved emergencies will appear here."}</p>
          </div>
        )}
      </div>
    </section>
  );
};

export default Emergencies;
