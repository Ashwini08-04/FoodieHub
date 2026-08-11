import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import api from "../api/api";
import "./Chatbot.css";

const formatMessageText = (text = "") => {
  return text
    .replace(/\*\*(.*?)\*\*/g, "$1")
    .replace(/\*(.*?)\*/g, "$1")
    .replace(/\#{1,6}\s*/gm, "")
    .replace(/`/g, "")
    .replace(/\n\s*-\s*/g, "\n• ")
    .trim();
};

const Chatbot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    {
      sender: "bot",
      text: "Hi! I'm your FoodieHub assistant. I can show you restaurant menus, help you find dishes, track orders, and book a meal for delivery. Try: Order 1 Margherita Pizza from Bella Pizza House to 123 Main St.",
    },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef(null);

  const suggestions = [
    "Show me restaurants and menus",
    "What can I order from Burger Barn?",
    "Order 1 Margherita Pizza from Bella Pizza House to 123 Main St",
    "Track my latest order"
  ];

  const sendUserMessage = async (messageText) => {
    const trimmed = messageText.trim();
    if (!trimmed) return;

    setMessages((prev) => [...prev, { sender: "user", text: trimmed }]);
    setInput("");
    setLoading(true);

    try {
      const res = await api.post("/chat", { message: trimmed });
      setMessages((prev) => [...prev, { sender: "bot", text: res.data.reply }]);
    } catch (error) {
      setMessages((prev) => [...prev, { sender: "bot", text: "Sorry, the assistant is unavailable right now. Please try again in a moment." }]);
    } finally {
      setLoading(false);
    }
  };

  const sendMessage = (e) => {
    e.preventDefault();
    sendUserMessage(input);
  };

  const handleSuggestion = (text) => {
    if (loading) return;
    sendUserMessage(text);
  };

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth", block: "end" });
  }, [messages, loading]);

  return (
    <div className="chatbot-wrapper">
      <AnimatePresence>
        {isOpen && (
          <motion.div
            className="chatbot-window"
            initial={{ opacity: 0, y: 50, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 50, scale: 0.9 }}
            transition={{ type: "spring", stiffness: 300, damping: 25 }}
          >
            <div className="chatbot-header">
              <div>
                <h3>FoodieHub Assistant</h3>
                <p className="chatbot-subtitle">Ask about restaurants, dishes, or place an order directly.</p>
              </div>
              <button onClick={() => setIsOpen(false)}>×</button>
            </div>
            <div className="chatbot-body">
              <div className="chatbot-suggestions">
                {suggestions.map((item) => (
                  <button key={item} type="button" onClick={() => handleSuggestion(item)}>{item}</button>
                ))}
              </div>
              {messages.map((msg, i) => (
                <div key={i} className={`chat-message ${msg.sender}`}>
                  <p>{msg.sender === "bot" ? formatMessageText(msg.text) : msg.text}</p>
                </div>
              ))}
              {loading && (
                <div className="chat-message bot typing">
                  <span className="dot"></span>
                  <span className="dot"></span>
                  <span className="dot"></span>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>
            <form className="chatbot-footer" onSubmit={sendMessage}>
              <input
                type="text"
                placeholder="Ask about restaurants, dishes, or say 'Order 1 burger from Burger Barn to 123 Main St'"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                disabled={loading}
              />
              <button type="submit" disabled={loading || !input.trim()}>{loading ? "Waiting..." : "Send"}</button>
            </form>
          </motion.div>
        )}
      </AnimatePresence>

      <motion.button
        className="chatbot-toggle"
        onClick={() => setIsOpen(!isOpen)}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
      >
        {isOpen ? "×" : "💬"}
      </motion.button>
    </div>
  );
};

export default Chatbot;
