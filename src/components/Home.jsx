// Home.jsx
import { useState, useRef, useEffect, useCallback } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUser, faArrowRightFromBracket, faGear, faUserCircle, faArrowLeft } from "@fortawesome/free-solid-svg-icons";
import ChatList from "./chat/ChatList";
import ChatWindow from "./chat/ChatWindow";
import { useNavigate } from "react-router-dom";
import { useTheme } from "../context/ThemeContext";
import thoodhuvanLogo from "../images/thoodhuvan_logo.png";

const Home = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [profileImgUrl, setProfileImgUrl] = useState(null);
  const [loading, setLoading] = useState(false);
  const [currentChat, setCurrentChat] = useState(null);
  const navigate = useNavigate();
  const { theme } = useTheme();
  const menuRef = useRef(null);
  const profileButtonRef = useRef(null);
  const token = localStorage.getItem("token");

  const fetchProfilePhoto = useCallback(async () => {
    if (!token) return;
    try {
      setLoading(true);
      const res = await fetch("http://localhost:8080/user/profile/photo", {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) {
        setProfileImgUrl(null);
        return;
      }
      const blob = await res.blob();
      const imageUrl = URL.createObjectURL(blob);
      setProfileImgUrl(imageUrl);
      localStorage.setItem("profilePhoto", imageUrl);
    } catch (error) {
      console.error("Error fetching profile photo:", error);
      setProfileImgUrl(null);
    } finally {
      setLoading(false);
    }
  }, [token]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        menuRef.current &&
        !menuRef.current.contains(event.target) &&
        profileButtonRef.current &&
        !profileButtonRef.current.contains(event.target)
      ) {
        setMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    fetchProfilePhoto();
  }, [fetchProfilePhoto]);

  const handleNavigation = (path) => {
    setMenuOpen(false);
    navigate(path);
  };

  const logout = () => {
    if (profileImgUrl) URL.revokeObjectURL(profileImgUrl);
    localStorage.clear();
    navigate("/");
  };

  const refreshProfilePhoto = () => fetchProfilePhoto();

  return (
    <div className={`flex flex-col h-screen ${theme === "dark" ? "bg-gray-900" : "bg-gray-100"}`}>
      {/* HEADER */}
      <header
        className={`${theme === "dark" ? "bg-gray-800" : "bg-white"} px-6 py-4 flex items-center justify-between relative z-50 border-b ${
          theme === "dark" ? "border-gray-700" : "border-gray-200"
        }`}
      >
        <div className="flex items-center gap-3">
          <div className="relative w-20 h-20">
            <img
              src={thoodhuvanLogo}
              alt="Thoodhuvan Logo"
              className="w-full h-full object-contain"
              onError={(e) => {
                e.target.style.display = "none";
                e.target.nextElementSibling.style.display = "flex";
              }}
            />
            <div
              className={`hidden w-full h-full rounded-full items-center justify-center text-xs font-bold ${
                theme === "dark" ? "bg-blue-600 text-white" : "bg-blue-500 text-white"
              }`}
            >
              T
            </div>
          </div>
          <h1 className={`text-3xl font-bold ${theme === "dark" ? "text-white" : "text-gray-900"}`}>Thoodhuvan</h1>
        </div>

        {/* Profile */}
        <div className="relative">
          <button
            ref={profileButtonRef}
            onClick={() => {
              setMenuOpen(!menuOpen);
              if (!profileImgUrl) fetchProfilePhoto();
            }}
            className="focus:outline-none transition-transform hover:scale-105 active:scale-95"
            disabled={loading}
          >
            {loading ? (
              <div className={`w-16 h-16 rounded-full flex items-center justify-center ${theme === "dark" ? "bg-gray-700" : "bg-gray-200"}`}>
                <div className={`w-10 h-10 rounded-full border-2 border-transparent animate-spin ${theme === "dark" ? "border-t-gray-400" : "border-t-blue-500"}`}></div>
              </div>
            ) : profileImgUrl ? (
              <div className="relative">
                <img
                  src={profileImgUrl}
                  alt="Profile"
                  className="w-20 h-20 rounded-full object-cover border-2 border-transparent hover:border-blue-500 transition-all"
                  onError={() => setProfileImgUrl(null)}
                />
                {menuOpen && <div className="absolute inset-0 rounded-full border-2 border-blue-500"></div>}
              </div>
            ) : (
              <div className={`w-20 h-20 rounded-full flex items-center justify-center ${theme === "dark" ? "bg-gray-700 text-gray-300" : "bg-gray-200 text-gray-700"}`}>
                <FontAwesomeIcon icon={faUser} />
              </div>
            )}
          </button>

          {menuOpen && (
            <>
              <div className="fixed inset-0 z-40" onClick={() => setMenuOpen(false)} />
              <div
                ref={menuRef}
                className={`fixed right-4 top-16 mt-1 w-56 rounded-lg z-50 border ${
                  theme === "dark" ? "border-gray-700" : "border-gray-200"
                }`}
                style={{
                  boxShadow: "0 20px 25px -5px rgba(0,0,0,0.1),0 10px 10px -5px rgba(0,0,0,0.04)",
                  backgroundColor: theme === "dark" ? "#1f2937" : "#ffffff",
                }}
              >
                <div className="py-2">
                  <button
                    onClick={() => handleNavigation("/profile")}
                    className={`w-full flex items-center gap-3 px-4 py-3 text-left transition-colors hover:bg-opacity-10 ${
                      theme === "dark" ? "text-gray-300 hover:bg-gray-600" : "text-gray-700 hover:bg-gray-100"
                    }`}
                  >
                    <FontAwesomeIcon icon={faUserCircle} className="w-4 h-4" /> Profile
                  </button>
                  <button
                    onClick={() => handleNavigation("/settings")}
                    className={`w-full flex items-center gap-3 px-4 py-3 text-left transition-colors hover:bg-opacity-10 ${
                      theme === "dark" ? "text-gray-300 hover:bg-gray-600" : "text-gray-700 hover:bg-gray-100"
                    }`}
                  >
                    <FontAwesomeIcon icon={faGear} className="w-4 h-4" /> Settings
                  </button>
                  <button
                    onClick={() => {
                      refreshProfilePhoto();
                      setMenuOpen(false);
                    }}
                    className={`w-full flex items-center gap-3 px-4 py-3 text-left transition-colors hover:bg-opacity-10 ${
                      theme === "dark" ? "text-gray-300 hover:bg-gray-600" : "text-gray-700 hover:bg-gray-100"
                    }`}
                  >
                    🔄 Refresh Photo
                  </button>
                  <div className={`mx-3 my-2 border-t ${theme === "dark" ? "border-gray-700" : "border-gray-200"}`}></div>
                  <button
                    onClick={logout}
                    className={`w-full flex items-center gap-3 px-4 py-3 text-left transition-colors hover:bg-opacity-10 ${
                      theme === "dark" ? "text-red-400 hover:bg-gray-600" : "text-red-600 hover:bg-gray-100"
                    }`}
                  >
                    <FontAwesomeIcon icon={faArrowRightFromBracket} className="w-4 h-4" /> Logout
                  </button>
                </div>
              </div>
            </>
          )}
        </div>
      </header>

      {/* BODY */}
      <div className="flex flex-1 overflow-hidden">
        {/* Chat List */}
        <div
          className={`flex flex-col w-full md:w-1/3 lg:w-1/4 border-r ${theme === "dark" ? "border-gray-700" : "border-gray-200"} ${
            currentChat ? "hidden md:flex" : "flex"
          }`}
        >
          <ChatList onSelectChat={setCurrentChat} theme={theme} />
        </div>

        {/* Chat Window */}
        <div
          className={`flex-1 flex flex-col ${
            !currentChat ? "hidden md:flex" : "flex"
          }`}
        >
          {currentChat ? (
            <ChatWindow
              chat={currentChat}
              theme={theme}
              onBack={() => setCurrentChat(null)}
            />
          ) : (
            <div className={`hidden md:flex flex-1 items-center justify-center ${theme === "dark" ? "bg-gray-900" : "bg-gray-50"}`}>
              <div className="text-center p-8 max-w-md">
                <div className={`w-20 h-20 rounded-full mx-auto mb-6 flex items-center justify-center ${theme === "dark" ? "bg-gray-800" : "bg-gray-200"}`}>💬</div>
                <h3 className={`text-xl font-semibold mb-3 ${theme === "dark" ? "text-white" : "text-gray-900"}`}>Welcome to Thoodhuvan Chat</h3>
                <p className={`mb-6 ${theme === "dark" ? "text-gray-400" : "text-gray-600"}`}>Select a conversation to start messaging.</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Home;
