/* eslint-disable react-refresh/only-export-components */
/* eslint-disable react/prop-types */
import { createContext, useEffect, useState } from "react";

export const ContextProvider = createContext();

const ContextApi = ({ children }) => {
  const [user, setUser] = useState(null);
  const [data, setData] = useState([]);
  const [token, setToken] = useState(null);

  const UpdateUser = (newUser) => {
    setUser(newUser);
  };
  const AddPost = (newPost) => {
    setData((date) => [newPost,...date]);
  };
  const UpdatePost = (newPost) => {
    const newData = data.map((ele) => {
      if (ele._id === newPost._id) {
        return newPost;
      }
      return ele;
    });
    setData(newData);
  };
  const UpdateToken = (newToken) => {
    setToken(newToken);
  }
  useEffect(() => {
    const FetchData = async () => {
      const response = await fetch("http://localhost:4000/api/v1/emergencies");
      const json = await response.json();
      if (response.ok) {
        setData(json.data);
      } else {
        throw new Error("Failed to fetch notes");
      }
    };
    FetchData();
  }, []);
  useEffect(() => {
    const GetToken = async () => {
      const response = await localStorage.getItem('token');
      if(response){
        setToken(response);
      }
    };
    GetToken();
    const GetUser = async () => {
      const response = await localStorage.getItem('user_data');
      if(response){
        const data = JSON.parse(response)
        setUser(data);
      }
    };
    GetUser();
    GetToken();
  }, []);
  useEffect(()=>{
    localStorage.setItem('token',token);
  },[token])
  useEffect(()=>{
    localStorage.setItem('user_data',JSON.stringify(user));
  },[user])
  return (
    <ContextProvider.Provider value={{ UpdateUser, user, data, AddPost ,UpdatePost ,token , UpdateToken}}>
      {children}
    </ContextProvider.Provider>
  );
};

export default ContextApi;
