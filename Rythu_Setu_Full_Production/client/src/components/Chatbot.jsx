import React, { useState } from "react";
import { sendChatMessage } from "../api";

export default function Chatbot() {
  const [message, setMessage] = useState("");
  const [reply, setReply] = useState("Ask me about crops, prices, pests or delivery.");

  const ask = async () => {
    if (!message.trim()) return;
    try {
      const res = await sendChatMessage(message);
      setReply(res.data.reply);
    } catch {
      setReply("Chatbot unavailable right now.");
    }
  };

  return (
    <div className="card soft">
      <h3>AI Farmer Assistant</h3>
      <div className="field">
        <textarea
          rows="3"
          placeholder="Ask a question"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
        />
      </div>
      <div className="button-row">
        <button className="btn btn-primary" type="button" onClick={ask}>Ask</button>
        <button className="btn btn-secondary" type="button" onClick={() => setMessage("")}>Clear</button>
      </div>
      <p className="small">{reply}</p>
    </div>
  );
}
