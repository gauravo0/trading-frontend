import React, { useState, useEffect } from "react";

interface Props {
  open: boolean;
  onClose: () => void;
}

export default function AIInsight({ open, onClose }: Props) {
  const [loading, setLoading] = useState(false);
  const [messages, setMessages] = useState([
    { role: "ai", text: "Hi 👋 Ask me about any stock!" },
  ]);

  const [input, setInput] = useState("");
  const [suggestions, setSuggestions] = useState<string[]>([]);

  useEffect(() => {
    if (!open) return;

    fetch("http://localhost:8080/api/ai/suggestions")
      .then((res) => res.json())
      .then((data) => setSuggestions(data))
      .catch(() => {
        setSuggestions([
          "AAPL - EMA breakout 📈",
          "TSLA - High volume spike 🚀",
          "INFY - RSI oversold 🔻",
        ]);
      });
  }, [open]);

  const sendMessage = async () => {
    if (!input.trim()) return;
    if (loading) return;

    setLoading(true);

    const userMsg = input;
    setInput("");

    setMessages((prev) => [...prev, { role: "user", text: userMsg }]);

    try {
      const res = await fetch("http://localhost:8080/api/ai/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ message: userMsg }),
      });

      const data = await res.json();

      setMessages((prev) => [...prev, { role: "ai", text: data.reply }]);
    } catch {
      setMessages((prev) => [...prev, { role: "ai", text: "⚠️ Server error" }]);
    }

    setLoading(false);
  };

  if (!open) return null;

  return (
    <div
      style={{
        position: "fixed",
        top: 0,
        right: 0,
        width: "400px",
        height: "100%",
        background: "#020617",
        borderLeft: "1px solid #1e293b",
        padding: "20px",
        zIndex: 1000,
        display: "flex",
        flexDirection: "column",
      }}
    >
      <div style={{ display: "flex", justifyContent: "space-between" }}>
        <h2>🤖 AI Assistant</h2>
        <button onClick={onClose}>X</button>
      </div>

      <div
        style={{
          flex: 1,
          overflowY: "auto",
          marginTop: "10px",
          border: "1px solid #1e293b",
          padding: "10px",
          borderRadius: "8px",
        }}
      >
        {messages.map((msg, i) => (
          <div key={i} style={{ marginBottom: "8px" }}>
            <b>{msg.role === "user" ? "You" : "AI"}:</b> {msg.text}
          </div>
        ))}
      </div>

      <div style={{ display: "flex", gap: "10px", marginTop: "10px" }}>
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") sendMessage();
          }}
          placeholder="Ask about stocks..."
          style={{
            flex: 1,
            padding: "8px",
            background: "#0f172a",
            border: "1px solid #334155",
            color: "white",
          }}
        />
        <button onClick={sendMessage} disabled={loading}>
          {loading ? "..." : "Send"}
        </button>
      </div>

      <div style={{ marginTop: "15px" }}>
        <h3>📊 Suggestions</h3>
        <ul>
          {suggestions.map((s, i) => (
            <li key={i}>{s}</li>
          ))}
        </ul>
      </div>
    </div>
  );
}
        right: 0,
        width: "400px",
        height: "100%",
        background: "#020617",
        borderLeft: "1px solid #1e293b",
        padding: "20px",
        zIndex: 1000,
        display: "flex",
        flexDirection: "column",
      }}
    >
      {/* HEADER */}
      <div style={{ display: "flex", justifyContent: "space-between" }}>
        <h2>🤖 AI Assistant</h2>
        <button onClick={onClose}>X</button>
      </div>

      {/* CHAT */}
      <div
        style={{
          flex: 1,
          overflowY: "auto",
          marginTop: "10px",
          border: "1px solid #1e293b",
          padding: "10px",
          borderRadius: "8px",
        }}
      >
        {messages.map((msg, i) => (
          <div key={i} style={{ marginBottom: "8px" }}>
            <b>{msg.role === "user" ? "You" : "AI"}:</b> {msg.text}
          </div>
        ))}
      </div>

      {/* INPUT */}
      <div style={{ display: "flex", gap: "10px", marginTop: "10px" }}>
  <input
    value={input}
    onChange={(e) => setInput(e.target.value)}
    onKeyDown={(e) => {
      if (e.key === "Enter") sendMessage();
    }}
    placeholder="Ask about stocks..."
    style={{
      flex: 1,
      padding: "8px",
      background: "#0f172a",
      border: "1px solid #334155",
      color: "white",
    }}
  />
  <button onClick={sendMessage} disabled={loading}>
    {loading ? "..." : "Send"}
  </button>
</div>

      {/* SUGGESTIONS */}
      <div style={{ marginTop: "15px" }}>
        <h3>📊 Suggestions</h3>
        <ul>
          {suggestions.map((s, i) => (
            <li key={i}>{s}</li>
          ))}
        </ul>
      </div>
    </div>
  );
}
>>>>>>> 2d59f32 (Save: commit all local changes)
