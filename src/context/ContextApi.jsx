/* eslint-disable react-refresh/only-export-components */
/* eslint-disable react/prop-types */
import { createContext, useEffect, useState } from "react";
import { API_BASE } from "../api";

export const ContextProvider = createContext();

const ContextApi = ({ children }) => {
  const [user, setUser] = useState(null);
  const [data, setData] = useState([]);
  const [token, setToken] = useState(null);

  // ── User helpers ──────────────────────────────────────────────────────────
  const UpdateUser = (newUser) => {
    setUser(newUser);
  };
  const UpdateToken = (newToken) => {
    setToken(newToken);
  };

  // ── Emergency helpers ─────────────────────────────────────────────────────
  const AddPost = (newPost) => {
    setData((prev) => [newPost, ...prev]);
  };
  const UpdatePost = (newPost) => {
    setData((prev) =>
      prev.map((ele) => (ele._id === newPost._id ? newPost : ele))
    );
  };
  const DeletePost = (id) => {
    setData((prev) => prev.filter((ele) => ele._id !== id));
  };

  // ── Fetch emergencies on mount ────────────────────────────────────────────
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(`${API_BASE}/emergencies`);
        const json = await response.json();
        if (response.ok) {
          setData(json.data);
        }
      } catch (err) {
        console.error("Failed to fetch emergencies:", err);
      }
    };
    fetchData();
  }, []);

  // ── Restore session from localStorage on mount ───────────────────────────
  useEffect(() => {
    const savedToken = localStorage.getItem("token");
    if (savedToken && savedToken !== "null") {
      setToken(savedToken);
    }

    const savedUser = localStorage.getItem("user_data");
    if (savedUser && savedUser !== "null") {
      try {
        setUser(JSON.parse(savedUser));
      } catch {
        // corrupted data — ignore
      }
    }
  }, []);

  // ── Persist session to localStorage when values change ───────────────────
  useEffect(() => {
    if (token !== null) {
      localStorage.setItem("token", token);
    }
  }, [token]);

  useEffect(() => {
    if (user !== null) {
      localStorage.setItem("user_data", JSON.stringify(user));
    } else {
      // User logged out — clear storage
      localStorage.removeItem("token");
      localStorage.removeItem("user_data");
    }
  }, [user]);

  return (
    <ContextProvider.Provider
      value={{ UpdateUser, user, data, AddPost, UpdatePost, DeletePost, token, UpdateToken }}
    >
      {children}
    </ContextProvider.Provider>
  );
};

export default ContextApi;
