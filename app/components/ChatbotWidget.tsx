"use client";

import { useState, useRef, useEffect } from "react";
import { MessageSquareText, X, Send, ChefHat } from "lucide-react";
import { sendChatMessage, type ChatMessage } from "../../lib/api";
import { useAuth } from "@clerk/nextjs";

const GREETING: ChatMessage = {
  role: "assistant",
  content:
    "Hi! I'm your FoodAI assistant. Ask me anything about Cameroonian dishes, nutrition, or meal recommendations!",
};

export default function ChatbotWidget() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([GREETING]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);
  const { isSignedIn, isLoaded } = useAuth();

  useEffect(() => {
    if (open) bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, open]);

  async function handleSend() {
    const text = input.trim();
    if (!text || loading) return;
    const userMsg: ChatMessage = { role: "user", content: text };
    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setLoading(true);
    try {
      const reply = await sendChatMessage([...messages, userMsg]);
      setMessages((prev) => [...prev, { role: "assistant", content: reply }]);
      } finally {
      setLoading(false);
    }
  }

  if (!isLoaded || !isSignedIn) return null;

  return (
    <>
      {/* FAB */}
      <button
        onClick={() => setOpen((v) => !v)}
        style={styles.fab}
        aria-label={open ? "Close chat" : "Open FoodAI chat"}
        id="chatbot-fab"
      >
        {open ? <X size={22} color="#fff" /> : <MessageSquareText size={22} color="#fff" />}
      </button>

      {/* Drawer */}
      {open && (
        <div style={styles.drawer} className="animate-slide-in chatbot-drawer" id="chatbot-drawer">
          {/* Header */}
          <div style={styles.drawerHeader}>
            <div style={styles.drawerAvatar}>
              <ChefHat size={18} color="var(--green-500)" />
            </div>
            <div>
              <div style={styles.drawerTitle}>FoodAI Assistant</div>
              <div style={styles.drawerSub}>
                <span style={styles.onlineDot} /> Online
              </div>
            </div>
            <button onClick={() => setOpen(false)} style={styles.closeBtn} aria-label="Close">
              <X size={18} />
            </button>
          </div>

          {/* Messages */}
          <div style={styles.messagesArea} id="chat-messages">
            {messages.map((msg, i) => (
              <div
                key={i}
                style={{
                  ...styles.msgWrap,
                  justifyContent: msg.role === "user" ? "flex-end" : "flex-start",
                }}
              >
                {msg.role === "assistant" && (
                  <div style={styles.aiBubbleAvatar}>
                    <ChefHat size={13} color="var(--green-500)" />
                  </div>
                )}
                <div
                  style={
                    msg.role === "user"
                      ? styles.userBubble
                      : styles.aiBubble
                  }
                >
                  {msg.content}
                </div>
              </div>
            ))}

            {/* Typing indicator */}
            {loading && (
              <div style={{ ...styles.msgWrap, justifyContent: "flex-start" }}>
                <div style={styles.aiBubbleAvatar}>
                  <ChefHat size={13} color="var(--green-500)" />
                </div>
                <div style={styles.typingBubble}>
                  <span style={{ ...styles.typingDot, animationDelay: "0ms" }} />
                  <span style={{ ...styles.typingDot, animationDelay: "160ms" }} />
                  <span style={{ ...styles.typingDot, animationDelay: "320ms" }} />
                </div>
              </div>
            )}
            <div ref={bottomRef} />
          </div>

          {/* Input */}
          <div style={styles.inputArea}>
            <input
              id="chat-input"
              style={styles.input}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSend()}
              placeholder="Ask about any dish…"
              disabled={loading}
              autoComplete="off"
            />
            <button
              onClick={handleSend}
              disabled={!input.trim() || loading}
              style={{
                ...styles.sendBtn,
                opacity: !input.trim() || loading ? 0.5 : 1,
              }}
              id="chat-send-btn"
              aria-label="Send message"
            >
              <Send size={16} color="#fff" />
            </button>
          </div>
        </div>
      )}
    </>
  );
}

const styles: Record<string, React.CSSProperties> = {
  fab: {
    position: "fixed",
    bottom: "28px",
    right: "28px",
    zIndex: 200,
    width: "56px",
    height: "56px",
    borderRadius: "50%",
    backgroundColor: "var(--green-500)",
    border: "none",
    cursor: "pointer",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    boxShadow: "0 4px 20px rgba(45,106,79,0.38)",
    transition: "transform var(--transition), box-shadow var(--transition)",
  },
  drawer: {
    position: "fixed",
    bottom: "96px",
    right: "28px",
    zIndex: 199,
    width: "360px",
    maxWidth: "calc(100vw - 40px)",
    height: "480px",
    maxHeight: "calc(100dvh - 120px)",
    backgroundColor: "var(--surface)",
    border: "1px solid var(--border)",
    borderRadius: "var(--radius-xl)",
    boxShadow: "var(--shadow-xl)",
    display: "flex",
    flexDirection: "column",
    overflow: "hidden",
  },
  drawerHeader: {
    display: "flex",
    alignItems: "center",
    gap: "12px",
    padding: "16px 18px",
    borderBottom: "1px solid var(--border)",
    backgroundColor: "var(--cream)",
    flexShrink: 0,
  },
  drawerAvatar: {
    width: "38px",
    height: "38px",
    borderRadius: "50%",
    backgroundColor: "var(--green-50)",
    border: "1px solid var(--green-100)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    flexShrink: 0,
  },
  drawerTitle: {
    fontSize: "0.9rem",
    fontWeight: 700,
    color: "var(--charcoal)",
  },
  drawerSub: {
    display: "flex",
    alignItems: "center",
    gap: "5px",
    fontSize: "0.72rem",
    color: "var(--text-secondary)",
  },
  onlineDot: {
    width: "7px",
    height: "7px",
    borderRadius: "50%",
    backgroundColor: "#34C759",
    display: "inline-block",
  },
  closeBtn: {
    marginLeft: "auto",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    width: "32px",
    height: "32px",
    borderRadius: "8px",
    border: "1px solid var(--border)",
    background: "transparent",
    cursor: "pointer",
    color: "var(--text-secondary)",
  },
  messagesArea: {
    flex: 1,
    overflowY: "auto",
    padding: "16px 14px",
    display: "flex",
    flexDirection: "column",
    gap: "12px",
  },
  msgWrap: {
    display: "flex",
    alignItems: "flex-end",
    gap: "8px",
  },
  aiBubbleAvatar: {
    width: "26px",
    height: "26px",
    borderRadius: "50%",
    backgroundColor: "var(--green-50)",
    border: "1px solid var(--green-100)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    flexShrink: 0,
  },
  aiBubble: {
    maxWidth: "80%",
    backgroundColor: "var(--cream-100)",
    border: "1px solid var(--cream-200)",
    borderRadius: "16px 16px 16px 4px",
    padding: "10px 14px",
    fontSize: "0.85rem",
    lineHeight: 1.55,
    color: "var(--charcoal)",
  },
  userBubble: {
    maxWidth: "80%",
    backgroundColor: "var(--green-500)",
    borderRadius: "16px 16px 4px 16px",
    padding: "10px 14px",
    fontSize: "0.85rem",
    lineHeight: 1.55,
    color: "#fff",
  },
  typingBubble: {
    display: "flex",
    alignItems: "center",
    gap: "5px",
    backgroundColor: "var(--cream-100)",
    border: "1px solid var(--cream-200)",
    borderRadius: "16px 16px 16px 4px",
    padding: "12px 16px",
  },
  typingDot: {
    width: "7px",
    height: "7px",
    borderRadius: "50%",
    backgroundColor: "var(--charcoal-200)",
    display: "inline-block",
    animation: "typing-dot 1.2s ease-in-out infinite",
  },
  inputArea: {
    display: "flex",
    gap: "10px",
    padding: "12px 14px",
    borderTop: "1px solid var(--border)",
    backgroundColor: "var(--cream)",
    flexShrink: 0,
  },
  input: {
    flex: 1,
    padding: "10px 14px",
    borderRadius: "var(--radius-full)",
    border: "1px solid var(--border)",
    backgroundColor: "var(--surface)",
    fontSize: "0.875rem",
    color: "var(--charcoal)",
    outline: "none",
    fontFamily: "inherit",
  },
  sendBtn: {
    width: "40px",
    height: "40px",
    borderRadius: "50%",
    backgroundColor: "var(--green-500)",
    border: "none",
    cursor: "pointer",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    flexShrink: 0,
    transition: "background-color var(--transition), opacity var(--transition)",
  },
};
