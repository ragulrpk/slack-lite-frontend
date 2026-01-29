import { useEffect, useState } from "react";

function ChatList({ onSelectChat }) {
  const [chats, setChats] = useState([]);
  const token = localStorage.getItem("token");

  useEffect(() => {
    fetchChats();
  }, []);

  const fetchChats = async () => {
    try {
      const res = await fetch("http://localhost:8080/chats/getMyChats", {
        headers: {
          "Authorization": "Bearer " + token,
        },
      });

      if (!res.ok) throw new Error("Failed to fetch chats");

      const data = await res.json();
      setChats(data);
    } catch (err) {
      console.error("Error fetching chats:", err);
    }
  };

  const getInitials = (name) => {
    if (!name) return "";
    const parts = name.split(" ");
    if (parts.length === 1) return name.substring(0, 2).toUpperCase();
    return (parts[0][0] + parts[1][0]).toUpperCase();
  };

  return (
    <div className="min-h-screen bg-white flex flex-col">

      {/* HEADER */}
      <div className="bg-blue-600 text-white p-4 text-xl font-bold shadow">
        SlackLite
      </div>

      {/* CHAT LIST */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        {chats.length === 0 ? (
          <p className="text-gray-400">No chats found</p>
        ) : (
          chats.map((chat) => (
            <div
              key={chat.channelId}
              onClick={() => onSelectChat(chat)}
              className="flex items-center p-3 bg-white border border-blue-200 rounded-lg shadow-sm hover:bg-blue-50 cursor-pointer"
            >
              {/* Avatar */}
              <div className="w-12 h-12 flex items-center justify-center rounded-full bg-blue-600 text-white font-bold text-lg mr-4">
                {getInitials(chat.displayName)}
              </div>

              {/* Chat Info */}
              <div className="flex-1">
                <div className="text-blue-700 font-semibold">
                  {chat.displayName}
                </div>
                <div className="text-sm text-blue-400">
                  {chat.channelType === "DM" ? "Direct Message" : "Group Chat"}
                </div>
              </div>

              {/* Time */}
              <div className="text-xs text-blue-300 whitespace-nowrap">
                {chat.lastMessageAt
                  ? new Date(chat.lastMessageAt).toLocaleString()
                  : ""}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default ChatList;
