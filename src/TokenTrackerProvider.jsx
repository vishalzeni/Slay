import React, { createContext, useContext, useEffect, useRef, useState } from "react";
import jwt_decode from "jwt-decode";

const TokenTrackerContext = createContext();

export function useTokenTracker() {
  return useContext(TokenTrackerContext);
}

export default function TokenTrackerProvider({ user, setUser, children }) {
  const [showDialog, setShowDialog] = useState(false);
  const [timeLeft, setTimeLeft] = useState(null);
  const timerRef = useRef();

  useEffect(() => {
    if (!user?.accessToken) {
      setShowDialog(false);
      setTimeLeft(null);
      clearTimeout(timerRef.current);
      return;
    }
    let decoded;
    try {
      decoded = jwt_decode(user.accessToken);
    } catch {
      setShowDialog(false);
      setTimeLeft(null);
      clearTimeout(timerRef.current);
      return;
    }
    const exp = decoded.exp * 1000;
    const now = Date.now();
    const warnBefore = 60 * 1000; // 1 min before expiry
    const timeUntilWarn = exp - now - warnBefore;
    if (timeUntilWarn <= 0) {
      setShowDialog(true);
      setTimeLeft(Math.max(0, exp - now));
    } else {
      timerRef.current = setTimeout(() => {
        setShowDialog(true);
        setTimeLeft(Math.max(0, exp - Date.now()));
      }, timeUntilWarn);
    }
    return () => clearTimeout(timerRef.current);
  }, [user?.accessToken]);

  // Optionally, update timeLeft every second when dialog is open
  useEffect(() => {
    if (!showDialog || !user?.accessToken) return;
    const interval = setInterval(() => {
      try {
        const exp = jwt_decode(user.accessToken).exp * 1000;
        setTimeLeft(Math.max(0, exp - Date.now()));
      } catch {
        setTimeLeft(0);
      }
    }, 1000);
    return () => clearInterval(interval);
  }, [showDialog, user?.accessToken]);

  const refreshToken = async () => {
    try {
      const res = await fetch("http://localhost:5000/api/refresh", {
        method: "POST",
        credentials: "include",
      });
      const data = await res.json();
      if (res.ok && data.accessToken) {
        setUser((prev) => {
          if (!prev) return null;
          const updated = { ...prev, accessToken: data.accessToken };
          localStorage.setItem("user", JSON.stringify(updated));
          return updated;
        });
        setShowDialog(false);
      } else {
        setShowDialog(false);
        setUser(null);
        localStorage.removeItem("user");
      }
    } catch {
      setShowDialog(false);
      setUser(null);
      localStorage.removeItem("user");
    }
  };

  return (
    <TokenTrackerContext.Provider value={{ showDialog, timeLeft, refreshToken }}>
      {children}
    </TokenTrackerContext.Provider>
  );
}
