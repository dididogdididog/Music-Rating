import { useState, useEffect, useContext, createContext } from "react";

const UserContext = createContext({
  userName: "",
  islogIn: false,
  setUserName: () => { },
  setIsLogIn: () => { }
});

const UserProvider = (props) => {
  const [userName, setUserName] = useState("");
  const [islogIn, setIsLogIn] = useState(false);
  return (
    <UserContext.Provider
      value={{
        userName,
        setUserName,
        islogIn,
        setIsLogIn,
      }}
      {...props}
    />
  )
}
const useUser = () => useContext(UserContext);
export { UserProvider, useUser };