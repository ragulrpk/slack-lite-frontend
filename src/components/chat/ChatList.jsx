import { useState, useEffect } from "react";
import axios from "axios";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faSearch,
  faMessage,
  faUsers,
  faPlus,
} from "@fortawesome/free-solid-svg-icons";

const ChatList = ({ onSelectChat, theme }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [chats, setChats] = useState([]);
  const [filteredChats, setFilteredChats] = useState([]);

  const token = localStorage.getItem("token");

  const api = axios.create({
    baseURL: "http://localhost:8080",
    headers: { Authorization: `Bearer ${token}` },
  });

  // ---------------- FETCH MY CHATS ----------------
  useEffect(() => {
    fetchChats();
  }, []);

  const formatChatTime = (timestamp) => {
    if (!timestamp) return "";

    const messageDate = new Date(timestamp);
    const now = new Date();

    const diffMs = now - messageDate;
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

    const isToday = messageDate.toDateString() === now.toDateString();

    const yesterday = new Date();
    yesterday.setDate(now.getDate() - 1);

    const isYesterday =
      messageDate.toDateString() === yesterday.toDateString();

    if (isToday) {
      return messageDate.toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
        hour12: true,
      });
    }

    if (isYesterday) {
      return "Yesterday";
    }

    return `${diffDays} day${diffDays > 1 ? "s" : ""} ago`;
  };

  const fetchChats = async () => {
    try {
      const response = await api.get("/chats/getMyChats");

      const mapped = response.data.map((chat) => ({
        id: chat.channelId,
        name: chat.displayName,
        type: chat.channelType,
        lastMessage: "",
        time: formatChatTime(chat.lastMessageAt),
        unread: 0,
        group: chat.channelType !== "DM",
      }));

      setChats(mapped);
      setFilteredChats(mapped);
    } catch (error) {
      console.error("Error fetching chats:", error);
    }
  };

  // ---------------- SEARCH ----------------
  useEffect(() => {
    if (!searchTerm.trim()) {
      setFilteredChats(chats);
      return;
    }

    const delayDebounce = setTimeout(() => {
      searchChats();
    }, 300);

    return () => clearTimeout(delayDebounce);
  }, [searchTerm]);

  const searchChats = async () => {
    try {
      const response = await api.get("/chats/search", {
        params: { name: searchTerm },
      });

      const searchResults = response.data.map((item) => ({
        id: item.channelId || `new-${item.username}`,
        name: item.username,
        type: item.type,
        lastMessage: "",
        time: "",
        unread: 0,
        group: item.type !== "DM",
        existing: item.existing,
      }));

      setFilteredChats(searchResults);
    } catch (error) {
      console.error("Search error:", error);
    }
  };

  const handleSelectChat = (chat) => {
    if (onSelectChat) onSelectChat(chat);
  };

  return (
    <div
      className={`h-full flex flex-col ${
        theme === "dark" ? "bg-gray-800" : "bg-white"
      }`}
    >
      {/* Header */}
      <div
        className={`px-4 py-3 border-b ${
          theme === "dark" ? "border-gray-700" : "border-gray-200"
        }`}
      >
        <div className="flex justify-between mb-3">
          <h2
            className={`text-xl font-bold ${
              theme === "dark" ? "text-white" : "text-gray-900"
            }`}
          >
            Messages
          </h2>

          <button className="p-2 bg-blue-500 text-white rounded-lg">
            <FontAwesomeIcon icon={faPlus} />
          </button>
        </div>

        {/* Search */}
        <div className="relative">
          <FontAwesomeIcon
            icon={faSearch}
            className="absolute left-3 top-3 text-gray-400"
          />

          <input
            type="text"
            placeholder="Search users or groups..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 rounded-xl border focus:outline-none"
          />
        </div>
      </div>

      {/* Chat List */}
      <div className="flex-1 overflow-y-auto">
        {filteredChats.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full">
            <FontAwesomeIcon icon={faMessage} size="2x" />
            <p>No conversations found</p>
          </div>
        ) : (
          filteredChats.map((chat) => (
            <div
              key={chat.id}
              onClick={() => handleSelectChat(chat)}
              className={`group px-4 py-3 cursor-pointer border-b transition-colors duration-150
                ${
                  theme === "dark"
                    ? "hover:bg-gray-100"
                    : "hover:bg-gray-100"
                }`}
            >
              <div className="flex items-center gap-3">
                {/* Avatar */}
                <div className="w-10 h-10 rounded-full bg-blue-500 flex items-center justify-center text-white">
                  {chat.group ? (
                    <FontAwesomeIcon icon={faUsers} />
                  ) : (
                    chat.name.charAt(0).toUpperCase()
                  )}
                </div>

                {/* Chat Info */}
                <div className="flex-1">
                  <div className="flex justify-between">
                    <span
                      className={`font-semibold transition-colors duration-150 ${
                        theme === "dark"
                          ? "text-white group-hover:text-black"
                          : "text-gray-900"
                      }`}
                    >
                      {chat.name}
                    </span>

                    <span className="text-xs text-gray-400">
                      {chat.time}
                    </span>
                  </div>

                  <p className="text-sm text-gray-500 truncate">
                    {chat.lastMessage}
                  </p>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default ChatList;