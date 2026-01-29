import ChatList from "./ChatList";
import ChatWindow from "./ChatWindow";
import { useState } from "react";

function Home() {
  const [selectedChat, setSelectedChat] = useState(null);

  return (
    
    <div className="flex h-screen">
      
      {/* LEFT SIDE */}
      <div className="w-1/3 border-r overflow-y-auto">
        <ChatList onSelectChat={setSelectedChat} />
      </div>

      {/* RIGHT SIDE */}
      <div className="w-2/3">
        <ChatWindow chat={selectedChat} />
      </div>

    </div>
  );
}

export default Home;
