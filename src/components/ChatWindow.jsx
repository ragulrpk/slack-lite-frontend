function ChatWindow({ chat }) {

  if (!chat) {
    return (
      <div className="h-full flex items-center justify-center text-gray-400 text-xl">
        Open a chat
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col">
      <div className="p-4 border-b font-bold text-lg text-blue-600">
        {chat.displayName}
      </div>
      
      <div className="flex-1 p-4 overflow-y-auto">
        Messages will load here...
      </div>

      <div className="p-4 border-t">
        <input
          type="text"
          placeholder="Type a message..."
          className="w-full border rounded p-2"
        />
      </div>
    </div>
  );
}

export default ChatWindow;
