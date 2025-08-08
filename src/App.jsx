import { useState, useRef, useEffect } from "react";
import ChatMessage from "./components/ChatMessage";
import ChatInput from "./components/ChatInput";
import Header from "./components/Header";
import LoadingDots from "./components/LoadingDots";

// Point this at your FastAPI server
// If using Vite, you can set VITE_API_BASE_URL in .env
const BACKEND_URL =
  import.meta?.env?.VITE_API_BASE_URL || "http://127.0.0.1:8000";

function App() {
  const [messages, setMessages] = useState([
    {
      id: 1,
      text: "Hello! I'm your Sri Lankan Legal LLM assistant. Ask about Companies Act, Inland Revenue Act, or Labor/Labour Laws.",
      isBot: true,
      timestamp: new Date(),
    },
  ]);
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef(null);

  // Keep one session_id per browser (so memory works)
  const sessionIdRef = useRef(null);
  if (!sessionIdRef.current) {
    const existing = localStorage.getItem("legal_llm_session_id");
    if (existing) {
      sessionIdRef.current = existing;
    } else {
      const sid = `sess_${Date.now()}_${Math.random().toString(36).slice(2)}`;
      localStorage.setItem("legal_llm_session_id", sid);
      sessionIdRef.current = sid;
    }
  }

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // OPTIONAL: Build the FAISS index once per tab session
  useEffect(() => {
    const alreadyIngested = sessionStorage.getItem("ingested_once");
    // Flip to true if you don't want the frontend to call ingest automatically.
    const AUTO_INGEST = false;

    if (!alreadyIngested && AUTO_INGEST) {
      fetch(`${BACKEND_URL}/ingest`, { method: "POST" })
        .then(() => sessionStorage.setItem("ingested_once", "true"))
        .catch((e) =>
          console.warn("Ingest failed (will still work if index exists):", e)
        );
    }
  }, []);

  const callFastAPIChat = async (prompt) => {
    const payload = {
      session_id: sessionIdRef.current,
      message: prompt,
    };

    const res = await fetch(`${BACKEND_URL}/chat`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    if (!res.ok) {
      const txt = await res.text().catch(() => "");
      throw new Error(`FastAPI /chat ${res.status}: ${txt}`);
    }
    const data = await res.json();

    // Backend returns: { session_id, is_legal, answer, citations: [], used_k }
    let text = data.answer || "No response.";
    if (Array.isArray(data.citations) && data.citations.length > 0) {
      // Append sources as plain text (no Markdown)
      const sourcesList = data.citations
        .map((s, i) => `${i + 1}) ${s}`)
        .join("\n");
      text += `\n\nSources:\n${sourcesList}`;
    }
    return { text, isLegal: !!data.is_legal };
  };

  const handleSendMessage = async (messageText) => {
    if (!messageText.trim()) return;

    const userMessage = {
      id: Date.now(),
      text: messageText,
      isBot: false,
      timestamp: new Date(),
    };
    setMessages((prev) => [...prev, userMessage]);
    setIsLoading(true);

    try {
      const { text } = await callFastAPIChat(messageText);

      const botMessage = {
        id: Date.now() + 1,
        text,
        isBot: true,
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, botMessage]);
    } catch (err) {
      console.error(err);
      const errorMessage = {
        id: Date.now() + 1,
        text: "Sorry, I couldn't reach the Legal LLM service. Check if the FastAPI server is running and CORS is enabled.",
        isBot: true,
        timestamp: new Date(),
        isError: true,
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const clearChat = () => {
    setMessages([
      {
        id: 1,
        text: "Hello! I'm your Sri Lankan Legal LLM assistant. Ask about Companies Act, Inland Revenue Act, or Labor/Labour Laws.",
        isBot: true,
        timestamp: new Date(),
      },
    ]);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <div className="container mx-auto max-w-4xl h-screen flex flex-col">
        <Header onClearChat={clearChat} />

        {/* Chat Messages Area */}
        <div className="flex-1 overflow-y-auto px-4 py-6 space-y-4">
          <div className="max-w-3xl mx-auto space-y-4">
            {messages.map((message) => (
              <ChatMessage key={message.id} message={message} />
            ))}

            {isLoading && (
              <div className="flex justify-start">
                <div className="bg-white rounded-2xl px-4 py-3 shadow-sm border border-gray-100 max-w-xs">
                  <LoadingDots />
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>
        </div>

        {/* Chat Input Area */}
        <div className="border-t border-gray-200 bg-white/80 backdrop-blur-sm">
          <div className="max-w-3xl mx-auto px-4 py-4">
            <ChatInput onSendMessage={handleSendMessage} disabled={isLoading} />
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
