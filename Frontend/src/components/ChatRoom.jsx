import React, { useEffect, useRef } from "react";
import ChatMessage from "./ChatMessage";

export default function ChatRoom({ messages, currentUser }) {
  const containerRef = useRef(null);

  useEffect(() => {
    if (!containerRef.current) return;
    containerRef.current.scrollTo({
      top: containerRef.current.scrollHeight,
      behavior: "smooth",
    });
  }, [messages]);

  if (!messages?.length) {
    return (
      <div className="flex flex-1 items-center justify-center bg-bg-base">
        <div className="rounded-2xl border border-dashed border-border-subtle px-12 py-10 text-center">
          <p className="font-display text-lg font-semibold text-text-primary">
            No messages yet
          </p>
          <p className="mt-2 max-w-sm text-sm text-text-muted">
            Say hello to start the conversation. Messages here disappear on
            their own — nothing sticks around by accident.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div
      ref={containerRef}
      className="flex-1 overflow-y-auto bg-bg-base px-4 py-6 sm:px-6"
    >
      <div className="mx-auto flex w-full max-w-3xl flex-col gap-4">
        {messages.map((msg) => {
          const key = msg.id ?? `${msg.sender}-${msg.createdAt}`;
          return (
            <ChatMessage
              key={key}
              message={msg}
              isMine={msg.sender === currentUser?.username}
            />
          );
        })}
      </div>
    </div>
  );
}