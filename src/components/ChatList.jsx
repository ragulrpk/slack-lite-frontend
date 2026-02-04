import { useEffect, useState, useRef } from "react";

function ChatList({ onSelectChat }) {
  const [chats, setChats] = useState([]);
  const [searchText, setSearchText] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const [loadingSearch, setLoadingSearch] = useState(false);

  const token = localStorage.getItem("token");
  const requestIdRef = useRef(0);

  // ✅ Fetch chats when component loads
  useEffect(() => {
    fetchChats();
  }, []);

  // ✅ Search effect with debounce
  useEffect(() => {
    const trimmed = searchText.trim();

    if (trimmed === "") {
      setIsSearching(false);
      setSearchResults([]);
      setLoadingSearch(false);
      return;
    }

    setIsSearching(true);
    setLoadingSearch(true);
    setSearchResults([]);

    const delay = setTimeout(() => {
      searchUsers(trimmed); // ✅ pass value instead of using state
    }, 0);

    return () => clearTimeout(delay);
  }, [searchText]);

  const fetchChats = async () => {
    try {
      const res = await fetch("http://localhost:8080/chats/getMyChats", {
        headers: {Authorization: "Bearer " + token},
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

  const searchUsers = async (query) => {
    const currentRequestId = ++requestIdRef.current;

    try {
      const res = await fetch(
        `http://localhost:8080/chats/search?name=${query}`,
        { headers: { Authorization: "Bearer " + token } }
      );

      if (!res.ok) throw new Error("Search failed");

      const data = await res.json();

      // Ignore old responses
      if (currentRequestId === requestIdRef.current) {
        setSearchResults(data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      if (currentRequestId === requestIdRef.current) {
        setLoadingSearch(false);
      }
    }
  };
  const existingChats = searchResults.filter(user =>
  chats.some(chat => chat.displayName === user.username)
   );

   const newChats = searchResults.filter(user =>
  !chats.some(chat => chat.displayName === user.username)
   );



  return (
    <div className="min-h-screen bg-white flex flex-col">
      {/* HEADER */}
      <div className="bg-blue-600 text-white p-4 text-xl font-bold shadow relative">
        SlackLite
        <input
          type="text"
          placeholder="Search users..."
          value={searchText}
          onChange={(e) => setSearchText(e.target.value)}
          className="ml-4 px-2 py-1 rounded text-black text-sm"
        />

        {isSearching && (
     <div className="absolute top-full mt-1 left-0 w-full bg-white shadow-lg rounded-lg p-2 z-10 max-h-60 overflow-y-auto">

    {loadingSearch ? (
      <p className="p-2 text-blue-500">Searching...</p>
    ) : searchResults.length === 0 ? (
      <p className="text-blue-400 p-2">No users found</p>
    ) : (
      <>
        {/* EXISTING CHATS */}
        {existingChats.length > 0 && (
          <>
            <p className="text-xs text-gray-400 px-2 mt-1">Chats</p>
            {existingChats.map((chat, index) => (
              <div
                key={"ex-" + index}
                onClick={() => {
                  onSelectChat({
                    displayName: chat.username,
                    channelId: chat.channelId,
                    channelType: chat.type,
                    isNew: false
                  });
                  setSearchText("");
                  setIsSearching(false);
                }}
                className="p-2 hover:bg-blue-200 cursor-pointer rounded text-blue-700"
              >
                💬 {chat.username}
              </div>
            ))}
          </>
        )}

        {/* NEW CHATS */}
        {newChats.length > 0 && (
          <>
            <p className="text-xs text-gray-400 px-2 mt-2">New Chats</p>
            {newChats.map((chat, index) => (
              <div
                key={"new-" + index}
                onClick={() => {
                  onSelectChat({
                    displayName: chat.username,
                    channelId: null,   // IMPORTANT
                    channelType: chat.type,
                    isNew: true
                  });
                  setSearchText("");
                  setIsSearching(false);
                }}
                className="p-2 hover:bg-green-200 cursor-pointer rounded text-green-700"
              >
                ➕ {chat.username}
              </div>
            ))}
          </>
        )}
      </>
    )}
    </div>
)}
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
              <div className="w-12 h-12 flex items-center justify-center rounded-full bg-blue-600 text-white font-bold text-lg mr-4">
                {getInitials(chat.displayName)}
              </div>

              <div className="flex-1">
                <div className="text-blue-700 font-semibold">
                  {chat.displayName}
                </div>
                <div className="text-sm text-blue-400">
                  {chat.channelType === "DM" ? "Direct Message" : "Group Chat"}
                </div>
              </div>

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
