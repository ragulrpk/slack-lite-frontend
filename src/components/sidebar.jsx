import { useEffect, useState, useCallback } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faGear,
  faUser,
  faRightFromBracket,
  faEllipsisVertical,
} from "@fortawesome/free-solid-svg-icons";
import axios from "axios";
import ErrorPopup from "./ErrorPopup";
import { useNavigate } from "react-router-dom";

const Sidebar = () => {
  const [profileImage, setProfileImage] = useState(null);
  const [errorMessage, setErrorMessage] = useState(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  const fetchProfilePhoto = useCallback(async () => {
    try {
      const res = await fetch("http://localhost:8080/user/profile/photo", {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) return;
      const blob = await res.blob();
      setProfileImage(URL.createObjectURL(blob));
    } catch {}
  }, [token]);

  useEffect(() => {
    fetchProfilePhoto();
  }, [fetchProfilePhoto]);

  const handleLogout = async () => {
    try {
      await axios.post(
        "http://localhost:8080/auth/logout",
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      localStorage.clear();
      navigate("/");
    } catch {
      setErrorMessage("Logout failed");
    }
  };

  return (
    <>
      {/* ================= DESKTOP SIDEBAR (Slack style) ================= */}
      <div className="hidden md:flex w-16 bg-gray-900 text-white flex-col items-center justify-end py-4 gap-4">
        <IconButton
          icon={faGear}
          onClick={() => navigate("/settings")}
        />

        <button
          onClick={() => navigate("/profile")}
          className="w-9 h-9 rounded-full overflow-hidden hover:bg-gray-700"
        >
          {profileImage ? (
            <img
              src={profileImage}
              alt="Profile"
              className="w-full h-full object-cover"
            />
          ) : (
            <FontAwesomeIcon icon={faUser} />
          )}
        </button>

        <IconButton
          icon={faRightFromBracket}
          onClick={handleLogout}
          danger
        />
      </div>

      {/* ================= MOBILE TOP MENU ================= */}
      <div className="md:hidden fixed top-3 right-4 z-50">
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="text-gray-700"
        >
          <FontAwesomeIcon icon={faEllipsisVertical} size="lg" />
        </button>

        {mobileMenuOpen && (
          <div className="absolute right-0 mt-2 w-40 bg-white rounded-lg shadow-lg overflow-hidden">
            <MobileItem
              label="Settings"
              onClick={() => {
                setMobileMenuOpen(false);
                navigate("/settings");
              }}
            />
            <MobileItem
              label="Profile"
              onClick={() => {
                setMobileMenuOpen(false);
                navigate("/profile");
              }}
            />
            <MobileItem
              label="Logout"
              danger
              onClick={() => {
                setMobileMenuOpen(false);
                handleLogout();
              }}
            />
          </div>
        )}
      </div>

      <ErrorPopup
        message={errorMessage}
        onClose={() => setErrorMessage(null)}
      />
    </>
  );
};

/* ------------------- SUB COMPONENTS ------------------- */

const IconButton = ({ icon, onClick, danger }) => (
  <button
    onClick={onClick}
    className={`w-9 h-9 rounded-full flex items-center justify-center
      ${danger ? "hover:bg-red-600" : "hover:bg-gray-700"}`}
  >
    <FontAwesomeIcon icon={icon} />
  </button>
);

const MobileItem = ({ label, onClick, danger }) => (
  <button
    onClick={onClick}
    className={`w-full px-4 py-2 text-left text-sm
      ${danger ? "text-red-600 hover:bg-red-50" : "hover:bg-gray-100"}`}
  >
    {label}
  </button>
);

export default Sidebar;
