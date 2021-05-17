import React, { useContext, useState, useEffect } from "react";

import { auth } from "../firebase";

const AuthContext = React.createContext();

export function useAuth() {
  return useContext(AuthContext);
}

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);

  function signup(email, password) {
    return auth.createUserWithEmailAndPassword(email, password);
  }

  const value = {
    currentUser,
    signup
  };

  useEffect(() => {
    //firebase sets up local storage to store the jwtToken and uses it to set the user
    const unsubscriber = auth.onAuthStateChanged((user) => {
      setCurrentUser(user);
      setLoading(false);
    });
    return unsubscriber;
  }, []);

  return <AuthContext.Provider value={value}>{!loading && children}</AuthContext.Provider>;
}
