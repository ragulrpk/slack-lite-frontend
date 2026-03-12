// src/pages/Profile.jsx
import { useEffect, useRef, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeft, faCamera } from "@fortawesome/free-solid-svg-icons";
import { useTheme } from "../context/ThemeContext";

const Profile = () => {
  const navigate = useNavigate();
  const fileInputRef = useRef(null);
  const { theme } = useTheme();

  const [profile, setProfile] = useState(null);
  const [profileImgUrl, setProfileImgUrl] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const token = localStorage.getItem("token");

  /* ================= FETCH PROFILE ================= */
  const fetchProfile = useCallback(async () => {
    try {
      const res = await axios.get("http://localhost:8080/user/profile", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setProfile(res.data);
    } catch {
      setError("Failed to load profile");
    }
  }, [token]);

  /* ================= FETCH PROFILE PHOTO ================= */
  const fetchProfilePhoto = useCallback(async () => {
    try {
      const res = await fetch("http://localhost:8080/user/profile/photo", {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!res.ok) {
        setProfileImgUrl(null);
        return;
      }

      const blob = await res.blob();
      setProfileImgUrl(URL.createObjectURL(blob));
    } catch {}
  }, [token]);

  useEffect(() => {
    if (token) {
      Promise.all([fetchProfile(), fetchProfilePhoto()])
        .finally(() => setLoading(false));
    } else {
      setError("No authentication token found");
      setLoading(false);
    }
  }, [fetchProfile, fetchProfilePhoto, token]);

  /* ================= IMAGE UPLOAD ================= */
  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("image", file);

    try {
      setUploading(true);
      await axios.post("http://localhost:8080/user/upload-image", formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      });
      // Refresh the photo
      await fetchProfilePhoto();
      
      // Update localStorage for Home.jsx
      const photoRes = await fetch("http://localhost:8080/user/profile/photo", {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (photoRes.ok) {
        const blob = await photoRes.blob();
        const newUrl = URL.createObjectURL(blob);
        localStorage.setItem("profilePhoto", newUrl);
      }
    } catch (err) {
      console.error("Error uploading image:", err);
      setError("Failed to upload image");
    } finally {
      setUploading(false);
    }
  };

  if (loading) {
    return (
      <div className={`min-h-screen ${theme === 'dark' ? 'bg-gray-900' : 'bg-gray-100'} 
        ${theme === 'dark' ? 'text-gray-100' : 'text-gray-900'}`}>
        <div className="flex items-center justify-center min-h-screen">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={`min-h-screen ${theme === 'dark' ? 'bg-gray-900' : 'bg-gray-100'} 
        ${theme === 'dark' ? 'text-gray-100' : 'text-gray-900'}`}>
        <div className="p-6">
          <div className="text-red-500">{error}</div>
          <button
            onClick={() => navigate(-1)}
            className="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen ${theme === 'dark' ? 'bg-gray-900' : 'bg-gray-100'} 
      ${theme === 'dark' ? 'text-gray-100' : 'text-gray-900'}`}>
      
      {/* HEADER - Same as Settings.jsx */}
      <div className={`flex items-center gap-4 px-4 py-4 border-b 
        ${theme === 'dark' ? 'border-gray-700' : 'border-gray-300'}`}>
        <button 
          onClick={() => navigate(-1)}
          className="hover:text-blue-500 transition-colors"
        >
          <FontAwesomeIcon icon={faArrowLeft} className="text-lg" />
        </button>
        <h1 className="text-lg font-semibold">Profile</h1>
      </div>

      {/* MAIN CONTENT - Original layout */}
      <div className="p-4">
        <div className={`w-full max-w-3xl mx-auto rounded-xl shadow-lg p-6
          ${theme === 'dark' ? 'bg-gray-800' : 'bg-white'}`}>
          
          <div className="flex flex-col md:flex-row gap-10 items-center md:items-start">

            {/* PROFILE PHOTO SECTION */}
            <div className="flex flex-col items-center">
              <div className="relative">
                <img
                  src={
                    profileImgUrl ||
                    `https://ui-avatars.com/api/?name=${profile.username}&background=6b7280&color=fff&bold=true`
                  }
                  alt="Profile"
                  className="w-32 h-32 rounded-full object-cover border
                    border-gray-300 dark:border-gray-600"
                  onError={(e) => {
                    // Fallback to avatar if image fails to load
                    e.target.src = `https://ui-avatars.com/api/?name=${profile.username}&background=6b7280&color=fff&bold=true`;
                  }}
                />

                <button
                  onClick={() => fileInputRef.current.click()}
                  className="absolute bottom-1 right-1 bg-blue-600 text-white
                    w-8 h-8 rounded-full flex items-center justify-center
                    hover:bg-blue-700 transition-colors shadow-md"
                  disabled={uploading}
                  title="Change photo"
                >
                  {uploading ? (
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  ) : (
                    <FontAwesomeIcon icon={faCamera} size="sm" />
                  )}
                </button>
              </div>

              <input
                type="file"
                accept="image/*"
                ref={fileInputRef}
                className="hidden"
                onChange={handleImageUpload}
              />

              {uploading && (
                <p className="text-sm mt-2 text-gray-500 dark:text-gray-400">
                  Uploading...
                </p>
              )}
            </div>

            {/* PROFILE DETAILS SECTION */}
            <div className="flex-1 w-full space-y-6">
              <div>
                <h2 className={`text-xl font-semibold mb-4 pb-2 border-b
                  ${theme === 'dark' ? 'border-gray-700' : 'border-gray-200'}`}>
                  Personal Information
                </h2>
                
                <div className="space-y-4">
                  <ProfileRow 
                    label="Username" 
                    value={profile.username} 
                    theme={theme} 
                  />
                  <ProfileRow 
                    label="Email" 
                    value={profile.email} 
                    theme={theme} 
                  />
                  <ProfileRow 
                    label="Phone" 
                    value={profile.mobile || "Not provided"} 
                    theme={theme} 
                  />
                  
                  {/* Additional fields if available in your API */}
                  {profile.department && (
                    <ProfileRow 
                      label="Department" 
                      value={profile.department} 
                      theme={theme} 
                    />
                  )}
                  
                  {profile.designation && (
                    <ProfileRow 
                      label="Designation" 
                      value={profile.designation} 
                      theme={theme} 
                    />
                  )}
                  
                  {profile.createdAt && (
                    <ProfileRow 
                      label="Member Since" 
                      value={new Date(profile.createdAt).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                      })} 
                      theme={theme} 
                    />
                  )}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3 pt-4">
                <button
                  onClick={() => navigate("/settings")}
                  className={`px-4 py-2 rounded-lg font-medium transition-colors
                    ${theme === 'dark' 
                      ? 'bg-gray-700 hover:bg-gray-600 text-gray-300' 
                      : 'bg-gray-200 hover:bg-gray-300 text-gray-800'}`}
                >
                  Settings
                </button>
                <button
                  onClick={() => navigate("/edit-profile")}
                  className={`px-4 py-2 rounded-lg font-medium transition-colors
                    ${theme === 'dark' 
                      ? 'bg-blue-600 hover:bg-blue-700 text-white' 
                      : 'bg-blue-600 hover:bg-blue-700 text-white'}`}
                >
                  Edit Profile
                </button>
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
};

/* ================= PROFILE ROW COMPONENT ================= */
const ProfileRow = ({ label, value, theme }) => (
  <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-4">
    <span className={`${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'} sm:w-28 font-medium`}>
      {label}
    </span>
    <span className={`flex-1 py-2 rounded-lg ${
      theme === 'dark' ? 'bg-gray-700 text-gray-200' : 'bg-gray-100 text-gray-800'
    }`}>
      {value}
    </span>
  </div>
);

export default Profile;