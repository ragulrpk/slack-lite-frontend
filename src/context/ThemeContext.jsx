// ThemeContext.jsx
import { createContext, useContext, useEffect, useState } from "react";

const ThemeContext = createContext();

export const ThemeProvider = ({ children }) => {
  const [theme, setTheme] = useState(
    localStorage.getItem("theme") || "dark"
  );
  const [textSize, setTextSize] = useState(
    parseInt(localStorage.getItem("textSize")) || 16
  );

  useEffect(() => {
    localStorage.setItem("theme", theme);
    document.documentElement.classList.toggle("dark", theme === "dark");
  }, [theme]);

  useEffect(() => {
    localStorage.setItem("textSize", textSize);
    document.documentElement.style.setProperty(
      "--text-size",
      `${textSize}px`
    );
    document.documentElement.style.setProperty(
      "--line-height",
      `${textSize + 8}px`
    );
  }, [textSize]);

  const toggleTheme = () => {
    setTheme(prev => prev === "dark" ? "light" : "dark");
  };

  return (
    <ThemeContext.Provider value={{ 
      theme, 
      setTheme, 
      toggleTheme,
      textSize, 
      setTextSize 
    }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => useContext(ThemeContext);