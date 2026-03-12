// Settings.jsx
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faArrowLeft,
  faMoon,
  faSun,
  faTextHeight,
  faLock,
} from "@fortawesome/free-solid-svg-icons";
import { useTheme } from "../context/ThemeContext";

const Settings = () => {
  const navigate = useNavigate();
  const { theme, toggleTheme, textSize, setTextSize } = useTheme();
  const [showPassword, setShowPassword] = useState(false);

  const handleTextSizeChange = (e) => {
    const newSize = parseInt(e.target.value);
    setTextSize(newSize);
  };

  return (
    <div className={`min-h-screen ${theme === 'dark' ? 'bg-gray-900' : 'bg-gray-100'} 
      ${theme === 'dark' ? 'text-gray-100' : 'text-gray-900'}`}>
      
      {/* HEADER */}
      <div className={`flex items-center gap-4 px-4 py-4 border-b 
        ${theme === 'dark' ? 'border-gray-700' : 'border-gray-300'}`}>
        <button onClick={() => navigate(-1)}>
          <FontAwesomeIcon icon={faArrowLeft} className="text-lg" />
        </button>
        <h1 className="text-lg font-semibold">Settings</h1>
      </div>

      {/* CONTENT */}
      <div className="max-w-3xl mx-auto px-4 py-6 space-y-8">
        {/* THEME */}
        <section className={`rounded-xl p-5 shadow 
          ${theme === 'dark' ? 'bg-gray-800' : 'bg-white'}`}>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <FontAwesomeIcon
                icon={theme === "dark" ? faMoon : faSun}
                className="text-xl"
              />
              <div>
                <p className="font-medium">Theme</p>
                <p className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
                  Switch between light and dark mode
                </p>
              </div>
            </div>

            <button
              onClick={toggleTheme}
              className={`px-4 py-2 rounded-lg ${theme === 'dark' ? 'bg-gray-700' : 'bg-gray-200'}`}
            >
              {theme === "dark" ? "Light" : "Dark"}
            </button>
          </div>
        </section>

        {/* TEXT SIZE */}
        <section className={`rounded-xl p-5 shadow 
          ${theme === 'dark' ? 'bg-gray-800' : 'bg-white'}`}>
          <div className="flex items-center gap-3 mb-4">
            <FontAwesomeIcon icon={faTextHeight} className="text-xl" />
            <div>
              <p className="font-medium">Text Size</p>
              <p className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
                Adjust overall app text size
              </p>
            </div>
          </div>

          <input
            type="range"
            min="14"
            max="24"
            step="1"
            value={textSize}
            onChange={handleTextSizeChange}
            className="w-full accent-blue-600"
          />

          <p className="mt-2 text-sm">
            Current size: <span className="font-semibold">{textSize}px</span>
          </p>
        </section>

        {/* CHANGE PASSWORD */}
        <section className={`rounded-xl p-5 shadow 
          ${theme === 'dark' ? 'bg-gray-800' : 'bg-white'}`}>
          <div className="flex items-center gap-3 mb-4">
            <FontAwesomeIcon icon={faLock} className="text-xl" />
            <div>
              <p className="font-medium">Change Password</p>
              <p className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
                Update your account password
              </p>
            </div>
          </div>

          <button
            onClick={() => setShowPassword(!showPassword)}
            className="text-blue-600 dark:text-blue-400 text-sm"
          >
            {showPassword ? "Cancel" : "Change Password"}
          </button>

          {showPassword && (
            <div className="mt-4 space-y-3">
              <input
                type="password"
                placeholder="Current password"
                className={`w-full px-3 py-2 rounded outline-none
                  ${theme === 'dark' 
                    ? 'bg-gray-700 text-gray-100 placeholder-gray-400' 
                    : 'bg-gray-100 text-gray-900'}`}
              />
              <input
                type="password"
                placeholder="New password"
                className={`w-full px-3 py-2 rounded outline-none
                  ${theme === 'dark' 
                    ? 'bg-gray-700 text-gray-100 placeholder-gray-400' 
                    : 'bg-gray-100 text-gray-900'}`}
              />
              <input
                type="password"
                placeholder="Confirm new password"
                className={`w-full px-3 py-2 rounded outline-none
                  ${theme === 'dark' 
                    ? 'bg-gray-700 text-gray-100 placeholder-gray-400' 
                    : 'bg-gray-100 text-gray-900'}`}
              />

              <button className={`w-full py-2 rounded-lg 
                ${theme === 'dark' 
                  ? 'bg-blue-700 hover:bg-blue-600' 
                  : 'bg-blue-600 hover:bg-blue-700'} text-white`}>
                Update Password
              </button>
            </div>
          )}
        </section>
      </div>
    </div>
  );
};

export default Settings;