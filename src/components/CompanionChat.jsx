import { useEffect, useState } from "react";
import Companion from "./Companion";
import { useAuth } from "../context/AuthContext";
import { getChatHistory, seedChat, sendChatMessage } from "../services/chatService";

export default function CompanionChat({
  mode = "home",
  opener = "Hey! What can I help you with today?",
  placeholder = "Ask FitBuddy...",
}) {
  const { user } = useAuth();
  const [messages, setMessages] = useState([]);
  const [text, setText] = useState("");
  const [sending, setSending] = useState(false);

  useEffect(() => {
    const existing = getChatHistory(mode);
    setMessages(existing.length ? existing : seedChat(mode, opener));
  }, [mode, opener]);

  async function onSubmit(event) {
    event.preventDefault();
    const value = text.trim();
    if (!value || sending) return;
    setText("");
    setSending(true);
    const result = await sendChatMessage({ mode, text: value });
    setMessages(result.history);
    setSending(false);
  }

  return (
    <div className="chat-card">
      <div className="chat-companion">
        <Companion
          color={user?.companion?.color}
          accessory={user?.companion?.accessory}
          size="xs"
        />
        <div>
          <strong>{user?.companion?.name || "FitBuddy"}</strong>
          <small>Your wellbeing companion</small>
        </div>
      </div>
      {messages.map((message) => (
        <div
          key={message.id}
          className={`message ${message.role === "user" ? "user" : message.role === "safety" ? "safety" : "bot"}`}
        >
          {message.title && <strong>{message.title}<br /></strong>}
          {message.text}
          {message.resources?.map((resource) => (
            <div key={resource.href}>
              <a href={resource.href} target="_blank" rel="noreferrer">{resource.label}</a>
            </div>
          ))}
        </div>
      ))}
      <p className="disclaimer">Replies are frontend placeholders until a real companion API is connected.</p>
      <form className="chat-input" onSubmit={onSubmit}>
        <input
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder={placeholder}
        />
        <button type="submit" disabled={sending} aria-label="Send">➤</button>
      </form>
    </div>
  );
}
