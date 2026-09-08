import { useState, useEffect, useRef } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import {
  faRobot,
  faXmark,
  faPaperPlane,
  faUtensils,
  faBagShopping,
  faLocationDot,
  faCircle
} from "@fortawesome/free-solid-svg-icons"
import api from "../api/api"
import "./Chatbot.css"

const formatMessageText = (text = "") => {
  return text
    .replace(/\*\*(.*?)\*\*/g, "$1")
    .replace(/\*(.*?)\*/g, "$1")
    .replace(/^#{1,6}\s*/gm, "")
    .replace(/`/g, "")
    .replace(/\n\s*[-*]\s*/g, "\n• ")
    .trim()
}

function Chatbot() {
  const [isOpen, setIsOpen] = useState(false)

  const [messages, setMessages] = useState([
    {
      sender: "bot",
      text:
        "Hi! I'm your FoodieHub assistant. I can help you discover restaurants, explore dishes, track orders, and even place an order for you."
    }
  ])

  const [input, setInput] = useState("")
  const [loading, setLoading] = useState(false)
  const [conversationId, setConversationId] = useState(null)

  const messagesEndRef = useRef(null)

  const suggestions = [
    {
      text: "Show me restaurants",
      icon: faUtensils
    },
    {
      text: "Help me find a dish",
      icon: faRobot
    },
    {
      text: "Track my latest order",
      icon: faBagShopping
    },
    {
      text: "Find food near me",
      icon: faLocationDot
    }
  ]

  // Send message
  const sendUserMessage = async (messageText) => {
    const trimmed = messageText.trim()

    if (!trimmed || loading) return

    const userMessage = {
      sender: "user",
      text: trimmed
    }

    setMessages((prev) => [...prev, userMessage])
    setInput("")
    setLoading(true)

    try {
      const response = await api.post("/chat", {
        message: trimmed,
        conversationId,
        history: messages
          .filter((message) => message.sender === "user" || message.sender === "bot")
          .slice(-10)
          .map((message) => ({
            role: message.sender === "user" ? "user" : "assistant",
            content: message.text
          }))
      })

      if (response.data?.conversationId) {
        setConversationId(response.data.conversationId)
      }

      setMessages((prev) => [
        ...prev,
        {
          sender: "bot",
          text:
            response.data?.reply ||
            "I'm sorry, I couldn't find an answer for that."
        }
      ])
    } catch (error) {
      console.error(
        "Chatbot error:",
        error.response?.data || error.message
      )

      setMessages((prev) => [
        ...prev,
        {
          sender: "bot",
          text:
            "Sorry, the assistant is unavailable right now. Please try again in a moment."
        }
      ])
    } finally {
      setLoading(false)
    }
  }

  // Form submit
  const sendMessage = (event) => {
    event.preventDefault()
    sendUserMessage(input)
  }

  // Suggestion click
  const handleSuggestion = (text) => {
    if (loading) return
    sendUserMessage(text)
  }

  // Auto scroll
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({
      behavior: "smooth",
      block: "end"
    })
  }, [messages, loading])

  return (
    <div className="chatbot-wrapper">
      <AnimatePresence>
        {isOpen && (
          <motion.div
            className="chatbot-window"
            initial={{
              opacity: 0,
              y: 30,
              scale: 0.94
            }}
            animate={{
              opacity: 1,
              y: 0,
              scale: 1
            }}
            exit={{
              opacity: 0,
              y: 30,
              scale: 0.94
            }}
            transition={{
              type: "spring",
              stiffness: 320,
              damping: 26
            }}
          >
            {/* Header */}
            <div className="chatbot-header">
              <div className="chatbot-brand">
                <div className="chatbot-avatar">
                  <FontAwesomeIcon icon={faRobot} />
                  <span className="online-dot"></span>
                </div>

                <div>
                  <div className="chatbot-title-row">
                    <h3>FoodieHub AI</h3>
                    <span className="ai-badge">AI</span>
                  </div>

                  <p>
                    Your personal food assistant
                  </p>
                </div>
              </div>

              <button
                className="chatbot-close"
                onClick={() => setIsOpen(false)}
                aria-label="Close chatbot"
              >
                <FontAwesomeIcon icon={faXmark} />
              </button>
            </div>

            {/* Body */}
            <div className="chatbot-body">
              <div className="chatbot-welcome">
                <span className="welcome-icon">
                  🍽️
                </span>

                <div>
                  <strong>
                    What are you craving?
                  </strong>

                  <p>
                    Ask me anything about FoodieHub.
                  </p>
                </div>
              </div>

              {/* Suggestions */}
              {messages.length === 1 && (
                <div className="chatbot-suggestions">
                  <span className="suggestion-label">
                    TRY ASKING
                  </span>

                  <div className="suggestion-list">
                    {suggestions.map((item) => (
                      <button
                        key={item.text}
                        type="button"
                        onClick={() =>
                          handleSuggestion(item.text)
                        }
                        disabled={loading}
                      >
                        <FontAwesomeIcon
                          icon={item.icon}
                        />
                        {item.text}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Messages */}
              <div className="chat-messages">
                {messages.map((message, index) => (
                  <div
                    key={index}
                    className={`chat-message ${message.sender}`}
                  >
                    {message.sender === "bot" && (
                      <div className="message-avatar">
                        <FontAwesomeIcon icon={faRobot} />
                      </div>
                    )}

                    <div className="message-content">
                      <span className="message-name">
                        {message.sender === "bot"
                          ? "FoodieHub AI"
                          : "You"}
                      </span>

                      <p>
                        {message.sender === "bot"
                          ? formatMessageText(message.text)
                          : message.text}
                      </p>
                    </div>
                  </div>
                ))}

                {loading && (
                  <div className="chat-message bot">
                    <div className="message-avatar">
                      <FontAwesomeIcon icon={faRobot} />
                    </div>

                    <div className="message-content">
                      <span className="message-name">
                        FoodieHub AI
                      </span>

                      <div className="typing">
                        <span className="dot"></span>
                        <span className="dot"></span>
                        <span className="dot"></span>
                      </div>
                    </div>
                  </div>
                )}

                <div ref={messagesEndRef} />
              </div>
            </div>

            {/* Footer */}
            <form
              className="chatbot-footer"
              onSubmit={sendMessage}
            >
              <div className="chatbot-input-wrap">
                <input
                  type="text"
                  placeholder="Ask about food, restaurants or orders..."
                  value={input}
                  onChange={(event) =>
                    setInput(event.target.value)
                  }
                  disabled={loading}
                />

                <button
                  type="submit"
                  disabled={
                    loading || !input.trim()
                  }
                  aria-label="Send message"
                >
                  <FontAwesomeIcon
                    icon={faPaperPlane}
                  />
                </button>
              </div>

              <div className="chatbot-footer-note">
                <FontAwesomeIcon icon={faCircle} />
                FoodieHub AI can help with your order
              </div>
            </form>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Floating Button */}
      <motion.button
        className={`chatbot-toggle ${
          isOpen ? "active" : ""
        }`}
        onClick={() =>
          setIsOpen((value) => !value)
        }
        whileHover={{ scale: 1.06 }}
        whileTap={{ scale: 0.94 }}
        aria-label="Open FoodieHub AI"
      >
        {isOpen ? (
          <FontAwesomeIcon icon={faXmark} />
        ) : (
          <>
            <FontAwesomeIcon icon={faRobot} />
            <span className="chatbot-pulse"></span>
          </>
        )}
      </motion.button>
    </div>
  )
}

export default Chatbot