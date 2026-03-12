// ChatWindow.jsx
import { useState, useRef, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { 
  faArrowLeft, 
  faPaperPlane, 
  faPaperclip, 
  faSmile,
  faEllipsisVertical,
  faPhone,
  faVideo,
  faMagnifyingGlass,
  faUserPlus,
  faImage,
  faFile,
  faMicrophone,
  faCircle,
  faUsers,
  faClock
} from "@fortawesome/free-solid-svg-icons";
import { useTheme } from "../../context/ThemeContext";

const ChatWindow = ({ chat, onBack }) => {
  const { theme } = useTheme();
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([
    { id: 1, text: "Hey team! How's the design coming along?", sender: "them", time: "10:30 AM", name: "Sarah Chen" },
    { id: 2, text: "Almost done with the homepage mockup!", sender: "them", time: "10:32 AM", name: "Alex Johnson" },
    { id: 3, text: "Great! I'll send the updated icons in a bit.", sender: "me", time: "10:33 AM" },
    { id: 4, text: "Don't forget about the meeting at 3 PM today.", sender: "them", time: "10:35 AM", name: "Mike Wilson" },
    { id: 5, text: "I've uploaded the latest design file. Can everyone review?", sender: "them", time: "10:40 AM", name: "Sarah Chen" },
    { id: 6, text: "Sure, I'll check it out after lunch.", sender: "me", time: "10:42 AM" },
    { id: 7, text: "The color scheme needs some adjustments.", sender: "them", time: "11:15 AM", name: "Emma Davis" },
  ]);
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);

  // Auto scroll to bottom
  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const handleSendMessage = () => {
    if (!message.trim()) return;
    
    const newMessage = {
      id: messages.length + 1,
      text: message,
      sender: "me",
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };
    
    setMessages([...messages, newMessage]);
    setMessage("");
    
    // Simulate reply after 1 second
    setIsTyping(true);
    setTimeout(() => {
      const replies = [
        "Thanks for your message!",
        "Got it, will review soon.",
        "Great point! Let's discuss.",
        "I'll look into that.",
      ];
      const randomReply = replies[Math.floor(Math.random() * replies.length)];
      
      const replyMessage = {
        id: messages.length + 2,
        text: randomReply,
        sender: "them",
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        name: chat?.name || "Team Member"
      };
      
      setMessages(prev => [...prev, replyMessage]);
      setIsTyping(false);
    }, 1000);
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  // Format time for messages
  const formatMessageTime = (timeString) => {
    return timeString;
  };

  return (
    <div className={`flex flex-col h-full ${theme === 'dark' ? 'bg-gray-900' : 'bg-white'}`}>
      {/* Chat Header - Fixed */}
      <div className={`flex items-center justify-between px-4 py-3 border-b ${theme === 'dark' ? 'border-gray-700' : 'border-gray-200'} flex-shrink-0`}>
        <div className="flex items-center gap-3">
          {/* Back button for mobile */}
          <button
            onClick={onBack}
            className="md:hidden p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
          >
            <FontAwesomeIcon 
              icon={faArrowLeft} 
              className={theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}
              size="lg"
            />
          </button>
          
          {/* Chat Info */}
          <div className="flex items-center gap-3">
            <div className="relative">
              <div className={`w-10 h-10 rounded-full flex items-center justify-center ${chat?.isGroup ? 'bg-purple-500' : 'bg-blue-500'} text-white`}>
                {chat?.isGroup ? (
                  <FontAwesomeIcon icon={faUsers} className="w-5 h-5" />
                ) : (
                  <span className="font-semibold">{chat?.name?.charAt(0) || "U"}</span>
                )}
              </div>
              {!chat?.isGroup && chat?.online && (
                <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full bg-green-500 border-2 border-white dark:border-gray-800"></div>
              )}
            </div>
            
            <div className="min-w-0">
              <h3 className={`font-semibold truncate ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                {chat?.name || "Select a chat"}
              </h3>
              <p className={`text-xs truncate ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
                {chat?.isGroup ? (
                  <span className="flex items-center gap-1">
                    <FontAwesomeIcon icon={faUsers} className="w-3 h-3" />
                    <span>8 members • 15 online</span>
                  </span>
                ) : chat?.online ? (
                  <span className="flex items-center gap-1 text-green-500">
                    <FontAwesomeIcon icon={faCircle} className="w-2 h-2" />
                    <span>Online</span>
                  </span>
                ) : (
                  <span className="flex items-center gap-1">
                    <FontAwesomeIcon icon={faClock} className="w-3 h-3" />
                    <span>Last seen 2h ago</span>
                  </span>
                )}
              </p>
            </div>
          </div>
        </div>

        {/* Header Actions - Responsive */}
        <div className="flex items-center gap-1 sm:gap-2">
          <button className={`p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>
            <FontAwesomeIcon icon={faPhone} className="w-4 h-4" />
          </button>
          <button className={`p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>
            <FontAwesomeIcon icon={faVideo} className="w-4 h-4" />
          </button>
          <button className={`hidden sm:block p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>
            <FontAwesomeIcon icon={faMagnifyingGlass} className="w-4 h-4" />
          </button>
          {chat?.isGroup && (
            <button className={`hidden sm:block p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>
              <FontAwesomeIcon icon={faUserPlus} className="w-4 h-4" />
            </button>
          )}
          <button className={`p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>
            <FontAwesomeIcon icon={faEllipsisVertical} className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Messages Container - Scrollable */}
      <div className={`flex-1 overflow-y-auto ${theme === 'dark' ? 'bg-gray-900' : 'bg-gray-50'}`}>
        <div className="p-4">
          {/* Date Separator */}
          <div className="flex justify-center mb-6">
            <span className={`px-3 py-1.5 rounded-full text-xs font-medium ${theme === 'dark' ? 'bg-gray-800 text-gray-300' : 'bg-gray-200 text-gray-600'}`}>
              Today, December 15
            </span>
          </div>

          {/* Messages */}
          <div className="space-y-3 sm:space-y-4">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex ${msg.sender === 'me' ? 'justify-end' : 'justify-start'}`}
              >
                <div className={`max-w-[85%] sm:max-w-[75%] md:max-w-[65%] ${msg.sender === 'me' ? 'order-2' : 'order-1'}`}>
                  {msg.sender !== 'me' && (
                    <div className="flex items-center gap-2 mb-1 ml-1">
                      <span className={`text-xs font-medium ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
                        {msg.name}
                      </span>
                      <span className={`text-xs ${theme === 'dark' ? 'text-gray-500' : 'text-gray-400'}`}>
                        {formatMessageTime(msg.time)}
                      </span>
                    </div>
                  )}
                  
                  <div
                    className={`px-3 sm:px-4 py-2.5 sm:py-3 rounded-2xl ${
                      msg.sender === 'me'
                        ? theme === 'dark' 
                          ? 'bg-blue-600 text-white rounded-br-none' 
                          : 'bg-blue-500 text-white rounded-br-none'
                        : theme === 'dark'
                          ? 'bg-gray-800 text-gray-200 rounded-bl-none'
                          : 'bg-white text-gray-900 rounded-bl-none border border-gray-200'
                    }`}
                  >
                    <p className="leading-relaxed break-words text-sm sm:text-base">{msg.text}</p>
                    
                    {/* Time for my messages */}
                    {msg.sender === 'me' && (
                      <div className="flex justify-end items-center gap-1 mt-1">
                        <span className={`text-xs ${theme === 'dark' ? 'text-blue-200' : 'text-blue-100'}`}>
                          {formatMessageTime(msg.time)}
                        </span>
                        <span className={`text-xs ${theme === 'dark' ? 'text-blue-200' : 'text-blue-100'}`}>
                          ✓✓
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}

            {/* Typing Indicator */}
            {isTyping && (
              <div className="flex justify-start">
                <div className={`px-4 py-3 rounded-2xl ${theme === 'dark' ? 'bg-gray-800' : 'bg-white'} rounded-bl-none border ${theme === 'dark' ? 'border-gray-700' : 'border-gray-200'}`}>
                  <div className="flex items-center gap-1">
                    <div className={`w-2 h-2 rounded-full animate-pulse ${theme === 'dark' ? 'bg-gray-500' : 'bg-gray-400'}`}></div>
                    <div className={`w-2 h-2 rounded-full animate-pulse ${theme === 'dark' ? 'bg-gray-500' : 'bg-gray-400'}`} style={{ animationDelay: '0.2s' }}></div>
                    <div className={`w-2 h-2 rounded-full animate-pulse ${theme === 'dark' ? 'bg-gray-500' : 'bg-gray-400'}`} style={{ animationDelay: '0.4s' }}></div>
                  </div>
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>
        </div>
      </div>

      {/* Message Input - Fixed at bottom */}
      <div className={`p-3 sm:p-4 border-t ${theme === 'dark' ? 'border-gray-700' : 'border-gray-200'} flex-shrink-0`}>
        <div className="flex items-end gap-2">
          {/* Attachment & Emoji Buttons */}
          <div className="flex items-center gap-1">
            <button className={`p-2 sm:p-3 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>
              <FontAwesomeIcon icon={faPaperclip} className="w-4 h-4" />
            </button>
            <button className={`p-2 sm:p-3 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>
              <FontAwesomeIcon icon={faSmile} className="w-4 h-4" />
            </button>
          </div>

          {/* Message Input */}
          <div className="flex-1 relative">
            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyDown={handleKeyPress}
              placeholder="Type a message..."
              rows="1"
              className={`w-full px-4 py-2.5 sm:py-3 pr-10 sm:pr-12 rounded-xl resize-none focus:outline-none focus:ring-2 transition-all
                ${theme === 'dark' 
                  ? 'bg-gray-800 border-gray-700 text-white placeholder-gray-400 focus:ring-blue-500 focus:border-transparent' 
                  : 'bg-gray-100 border-gray-200 text-gray-900 placeholder-gray-500 focus:ring-blue-400 focus:border-transparent'}`}
              style={{ minHeight: '40px', maxHeight: '100px' }}
            />
            
            {/* Quick Action Buttons - Hidden when typing */}
            {!message.trim() && (
              <div className="absolute right-2 sm:right-3 top-1/2 transform -translate-y-1/2 flex items-center gap-1 sm:gap-2">
                <button className={`p-1 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
                  <FontAwesomeIcon icon={faImage} className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                </button>
                <button className={`p-1 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
                  <FontAwesomeIcon icon={faFile} className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                </button>
                <button className={`p-1 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
                  <FontAwesomeIcon icon={faMicrophone} className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                </button>
              </div>
            )}
          </div>

          {/* Send Button */}
          <button
            onClick={handleSendMessage}
            disabled={!message.trim()}
            className={`p-2.5 sm:p-3 rounded-xl transition-all flex-shrink-0 ${message.trim() 
              ? theme === 'dark' 
                ? 'bg-blue-600 hover:bg-blue-700 text-white' 
                : 'bg-blue-500 hover:bg-blue-600 text-white'
              : theme === 'dark'
                ? 'bg-gray-700 text-gray-400 cursor-not-allowed'
                : 'bg-gray-200 text-gray-400 cursor-not-allowed'}`}
          >
            <FontAwesomeIcon icon={faPaperPlane} className="w-4 h-4" />
          </button>
        </div>
        
        {/* Quick Tips - Hidden on small mobile */}
        <p className={`hidden sm:block text-xs mt-2 text-center ${theme === 'dark' ? 'text-gray-500' : 'text-gray-400'}`}>
          Press Enter to send • Shift+Enter for new line
        </p>
      </div>
    </div>
  );
};

export default ChatWindow;