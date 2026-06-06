"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { MessageSquareText, X, Send, ChefHat, ImagePlus, Trash2, History, ArrowUp } from "lucide-react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import {
  sendChatMessage,
  identifyMealFromImage,
  getChatSessions,
  getChatHistory,
  deleteChatSession,
  type ChatMessage,
  type ChatSession,
} from "../../lib/api";
import { useAuth } from "@clerk/nextjs";

const GREETING: ChatMessage = {
  role: "assistant",
  content: "Hi! I'm CamChef 🍲, your Cameroonian food AI. Ask me anything about dishes, nutrition, or meal recommendations, or upload a photo to identify a meal!",
};

export default function ChatbotWidget() {
  const [open, setOpen] = useState(false);
  const [view, setView] = useState<"chat" | "sessions">("chat");
  const [messages, setMessages] = useState<ChatMessage[]>([GREETING]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [sessions, setSessions] = useState<ChatSession[]>([]);
  const [sessionsLoading, setSessionsLoading] = useState(false);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [showScrollTop, setShowScrollTop] = useState(false);
  const [showPageScrollTop, setShowPageScrollTop] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);
  const messagesAreaRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { isSignedIn, isLoaded, userId } = useAuth();

  useEffect(() => {
    if (open) bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, open]);

  useEffect(() => {
    const messagesArea = messagesAreaRef.current;
    if (!messagesArea) return;

    const handleScroll = () => {
      const isScrolledDown = messagesArea.scrollHeight - messagesArea.scrollTop > messagesArea.clientHeight + 100;
      setShowScrollTop(isScrolledDown);
    };

    messagesArea.addEventListener("scroll", handleScroll);
    return () => messagesArea.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const handlePageScroll = () => {
      setShowPageScrollTop(window.scrollY > 300);
    };
    // Initial check in case the page is already scrolled on mount
    handlePageScroll();
    window.addEventListener("scroll", handlePageScroll);
    return () => window.removeEventListener("scroll", handlePageScroll);
  }, []);

  function scrollToTop() {
    if (messagesAreaRef.current) {
      messagesAreaRef.current.scrollTo({ top: 0, behavior: "smooth" });
    }
  }

  function scrollPageToTop() {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  // Load sessions when opening sessions view
  const loadSessions = useCallback(async () => {
    if (!userId) return;
    setSessionsLoading(true);
    const data = await getChatSessions(userId);
    setSessions(data);
    setSessionsLoading(false);
  }, [userId]);

  useEffect(() => {
    if (view === "sessions") loadSessions();
  }, [view, loadSessions]);

  async function handleSend() {
    const text = input.trim();
    if ((!text && !imageFile) || loading) return;

    // If there's an image, use identify-meal endpoint
    if (imageFile) {
      const userMsg: ChatMessage = {
        role: "user",
        content: text ? `🖼️ [Image] ${text}` : "🖼️ What meal is this?",
      };
      setMessages((prev) => [...prev, userMsg]);
      setInput("");
      setImageFile(null);
      setImagePreview(null);
      setLoading(true);
      try {
        const { reply } = await identifyMealFromImage(imageFile, text || undefined, userId || undefined, sessionId);
        setMessages((prev) => [...prev, { role: "assistant", content: reply }]);
      } catch (err: any) {
        setMessages((prev) => [...prev, { role: "assistant", content: "Sorry, I couldn't analyse that image. Please try again." }]);
      } finally {
        setLoading(false);
      }
      return;
    }

    // Regular text chat
    const userMsg: ChatMessage = { role: "user", content: text };
    const updatedMessages = [...messages, userMsg];
    setMessages(updatedMessages);
    setInput("");
    setLoading(true);
    try {
      const { reply, sessionId: newSessionId } = await sendChatMessage(
        updatedMessages,
        userId!,
        sessionId
      );
      if (newSessionId && !sessionId) setSessionId(newSessionId);
      setMessages((prev) => [...prev, { role: "assistant", content: reply }]);
    } catch (err: any) {
      setMessages((prev) => [...prev, {
        role: "assistant",
        content: "I'm having trouble connecting right now. Please try again shortly.",
      }]);
    } finally {
      setLoading(false);
    }
  }

  async function handleLoadSession(sid: string) {
    setLoading(true);
    const history = await getChatHistory(sid);
    setSessionId(sid);
    setMessages(history.length > 0 ? history : [GREETING]);
    setView("chat");
    setLoading(false);
  }

  async function handleDeleteSession(e: React.MouseEvent, sid: string) {
    e.stopPropagation();
    await deleteChatSession(sid);
    setSessions((prev) => prev.filter((s) => s.id !== sid));
    if (sessionId === sid) {
      setSessionId(null);
      setMessages([GREETING]);
    }
  }

  function handleNewChat() {
    setSessionId(null);
    setMessages([GREETING]);
    setView("chat");
  }

  function handleImageSelect(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setImageFile(file);
    setImagePreview(URL.createObjectURL(file));
    if (fileInputRef.current) fileInputRef.current.value = "";
  }

  if (!isLoaded || !isSignedIn) return null;

  return (
    <div className={open ? "chatbot-open" : ""}>
      <style>{`
        @media (max-width: 768px) {
          .chatbot-drawer {
            bottom: 0 !important;
            right: 0 !important;
            width: 100vw !important;
            max-width: 100vw !important;
            height: 100dvh !important;
            max-height: 100dvh !important;
            border-radius: 0 !important;
            border: none !important;
            display: flex !important;
            flex-direction: column !important;
          }
          .chatbot-open #chatbot-fab {
            display: none !important;
          }
        }
        .markdown-body p { margin-bottom: 0.5em; }
        .markdown-body p:last-child { margin-bottom: 0; }
        .markdown-body ul { padding-left: 1.5em; margin-bottom: 0.5em; list-style-type: disc; }
        .markdown-body ol { padding-left: 1.5em; margin-bottom: 0.5em; list-style-type: decimal; }
        .markdown-body li { margin-bottom: 0.25em; }
        .markdown-body strong { font-weight: 700; }
        .markdown-body em { font-style: italic; }
        .markdown-body h3 { font-size: 1.1em; font-weight: 700; margin-top: 0.8em; margin-bottom: 0.4em; }
        .markdown-body h4 { font-size: 1em; font-weight: 700; margin-top: 0.6em; margin-bottom: 0.3em; }
      `}</style>

      {/* FAB */}
      <button
        onClick={() => setOpen((v) => !v)}
        style={styles.fab}
        aria-label={open ? "Close chat" : "Open CamChef AI chat"}
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
            <div style={{ flex: 1 }}>
              <div style={styles.drawerTitle}>CamChef AI</div>
              <div style={styles.drawerSub}>
                <span style={styles.onlineDot} /> Online
              </div>
            </div>
            <button
              onClick={() => setView(view === "sessions" ? "chat" : "sessions")}
              style={styles.iconBtn}
              title="Chat history"
              aria-label="Chat history"
            >
              <History size={16} />
            </button>
            <button
              onClick={handleNewChat}
              style={{ ...styles.iconBtn, marginLeft: "4px" }}
              title="New chat"
              aria-label="New chat"
            >
              <MessageSquareText size={16} />
            </button>
            <button onClick={() => setOpen(false)} style={{ ...styles.iconBtn, marginLeft: "4px" }} aria-label="Close">
              <X size={16} />
            </button>
          </div>

          {/* Sessions panel */}
          {view === "sessions" ? (
            <div style={styles.sessionsPanel}>
              <p style={styles.sessionsPanelTitle}>Previous Conversations</p>
              {sessionsLoading ? (
                <div style={styles.sessionsEmpty}>Loading…</div>
              ) : sessions.length === 0 ? (
                <div style={styles.sessionsEmpty}>No previous chats yet.</div>
              ) : (
                sessions.map((s) => (
                  <div
                    key={s.id}
                    style={styles.sessionRow}
                    onClick={() => handleLoadSession(s.id)}
                    role="button"
                    tabIndex={0}
                  >
                    <div style={styles.sessionInfo}>
                      <div style={styles.sessionLabel}>Chat session</div>
                      <div style={styles.sessionDate}>
                        {new Date(s.updated_at).toLocaleDateString(undefined, {
                          month: "short", day: "numeric", hour: "2-digit", minute: "2-digit",
                        })}
                      </div>
                    </div>
                    <button
                      onClick={(e) => handleDeleteSession(e, s.id)}
                      style={styles.deleteSessionBtn}
                      title="Delete session"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                ))
              )}
            </div>
          ) : (
            <>
              {/* Messages */}
              <div style={styles.messagesArea} id="chat-messages" ref={messagesAreaRef}>
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
                    <div style={msg.role === "user" ? styles.userBubble : styles.aiBubble} className="markdown-body">
                      <ReactMarkdown remarkPlugins={[remarkGfm]}>
                        {msg.content}
                      </ReactMarkdown>
                    </div>
                  </div>
                ))}

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

              {/* Image preview strip */}
              {imagePreview && (
                <div style={styles.imagePreviewBar}>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={imagePreview} alt="Preview" style={styles.imageThumb} />
                  <span style={styles.imagePreviewName}>{imageFile?.name}</span>
                  <button
                    onClick={() => { setImageFile(null); setImagePreview(null); }}
                    style={styles.removeImageBtn}
                    aria-label="Remove image"
                  >
                    <X size={14} />
                  </button>
                </div>
              )}

              {/* Input */}
              <div style={styles.inputArea}>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/jpeg,image/png,image/webp,image/gif"
                  style={{ display: "none" }}
                  onChange={handleImageSelect}
                  id="chatbot-image-input"
                />
                <button
                  onClick={() => fileInputRef.current?.click()}
                  style={styles.imageBtn}
                  title="Upload meal photo"
                  aria-label="Upload meal photo"
                  disabled={loading}
                >
                  <ImagePlus size={18} color="var(--green-500)" />
                </button>
                <textarea
                  id="chat-input"
                  style={{ ...styles.input, resize: "none", minHeight: "40px", maxHeight: "120px", padding: "10px 14px", lineHeight: "1.2" }}
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && !e.shiftKey) {
                      e.preventDefault();
                      if (input.trim() || imageFile) handleSend();
                    }
                  }}
                  placeholder={imageFile ? "Ask about this image…" : "Ask about any dish…"}
                  disabled={loading}
                  rows={input.split("\n").length > 1 ? Math.min(input.split("\n").length, 4) : 1}
                />
                <button
                  onClick={handleSend}
                  disabled={(!input.trim() && !imageFile) || loading}
                  style={{
                    ...styles.sendBtn,
                    opacity: (!input.trim() && !imageFile) || loading ? 0.5 : 1,
                  }}
                  id="chat-send-btn"
                  aria-label="Send message"
                >
                  <Send size={16} color="#fff" />
                </button>
              </div>
            </>
          )}
        </div>
      )}
    </div>
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
    height: "520px",
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
    gap: "10px",
    padding: "14px 16px",
    borderBottom: "1px solid var(--border)",
    backgroundColor: "var(--cream)",
    flexShrink: 0,
  },
  drawerAvatar: {
    width: "36px",
    height: "36px",
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
  iconBtn: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    width: "30px",
    height: "30px",
    borderRadius: "8px",
    border: "1px solid var(--border)",
    background: "transparent",
    cursor: "pointer",
    color: "var(--text-secondary)",
    flexShrink: 0,
  },
  sessionsPanel: {
    flex: 1,
    overflowY: "auto",
    padding: "16px",
    display: "flex",
    flexDirection: "column",
    gap: "8px",
  },
  sessionsPanelTitle: {
    fontSize: "0.78rem",
    fontWeight: 700,
    color: "var(--text-secondary)",
    textTransform: "uppercase",
    letterSpacing: "0.04em",
    marginBottom: "8px",
  },
  sessionsEmpty: {
    textAlign: "center",
    color: "var(--text-secondary)",
    fontSize: "0.875rem",
    padding: "24px 0",
  },
  sessionRow: {
    display: "flex",
    alignItems: "center",
    gap: "10px",
    padding: "12px 14px",
    borderRadius: "10px",
    border: "1px solid var(--border)",
    cursor: "pointer",
    backgroundColor: "var(--cream)",
    transition: "background var(--transition)",
  },
  sessionInfo: {
    flex: 1,
  },
  sessionLabel: {
    fontSize: "0.875rem",
    fontWeight: 600,
    color: "var(--charcoal)",
  },
  sessionDate: {
    fontSize: "0.75rem",
    color: "var(--text-secondary)",
    marginTop: "2px",
  },
  deleteSessionBtn: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    width: "28px",
    height: "28px",
    border: "none",
    borderRadius: "8px",
    background: "transparent",
    color: "var(--text-secondary)",
    cursor: "pointer",
    flexShrink: 0,
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
    whiteSpace: "pre-wrap",
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
  imagePreviewBar: {
    display: "flex",
    alignItems: "center",
    gap: "10px",
    padding: "8px 14px",
    borderTop: "1px solid var(--border)",
    backgroundColor: "var(--green-50)",
    flexShrink: 0,
  },
  imageThumb: {
    width: "40px",
    height: "40px",
    objectFit: "cover",
    borderRadius: "8px",
    border: "1px solid var(--border)",
    flexShrink: 0,
  },
  imagePreviewName: {
    flex: 1,
    fontSize: "0.78rem",
    color: "var(--charcoal)",
    overflow: "hidden",
    textOverflow: "ellipsis",
    whiteSpace: "nowrap",
  },
  removeImageBtn: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    width: "24px",
    height: "24px",
    border: "none",
    background: "transparent",
    cursor: "pointer",
    color: "var(--text-secondary)",
    flexShrink: 0,
  },
  inputArea: {
    display: "flex",
    gap: "8px",
    padding: "12px 14px",
    borderTop: "1px solid var(--border)",
    backgroundColor: "var(--cream)",
    flexShrink: 0,
    alignItems: "flex-end",
  },
  imageBtn: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    width: "36px",
    height: "36px",
    border: "1px solid var(--border)",
    borderRadius: "50%",
    background: "var(--surface)",
    cursor: "pointer",
    flexShrink: 0,
    transition: "background var(--transition)",
  },
  input: {
    flex: 1,
    padding: "10px 14px",
    borderRadius: "16px",
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
