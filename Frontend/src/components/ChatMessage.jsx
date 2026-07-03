import React from "react";
import { useAuth } from "../context/AuthContext";

export default function ChatMessage({ message }) {
  const { user } = useAuth();
  const mine = message.senderName === user?.username;
  return (
    <div className={`message ${mine ? "me" : "other"}`}>
      <div className="meta">
        <strong>{message.senderName}</strong>{" "}
        <span className="time">
          {new Date(message.timestamp).toLocaleTimeString()}
        </span>
      </div>
      <div className="content">{message.content}</div>
    </div>
  );
}
