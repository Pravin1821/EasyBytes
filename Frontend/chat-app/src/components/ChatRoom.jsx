import React, { useEffect, useRef } from "react";

const formatTimestamp = (value) => {
  if (!value) return "";
  const date = new Date(value);
  return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
};

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
      <div className="flex flex-1 items-center justify-center bg-slate-950/60">
        <div className="rounded-2xl border border-dashed border-slate-700 px-12 py-10 text-center">
          <p className="text-lg font-semibold text-slate-200">
            No messages yet
          </p>
          <p className="mt-2 max-w-sm text-sm text-slate-500">
            Say hello to start the conversation. Your messages will appear here
            instantly.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div
      ref={containerRef}
      className="flex-1 overflow-y-auto bg-slate-950/60 px-4 py-6 sm:px-6"
    >
      <div className="mx-auto flex w-full max-w-3xl flex-col gap-4">
        {messages.map((msg) => {
          const mine = msg.sender === currentUser?.username;
          const key = `${msg.id ?? `${msg.sender}-${msg.createdAt}`}`;
          return (
            <div
              key={key}
              className={`flex ${mine ? "justify-end" : "justify-start"}`}
            >
              <div
                className={`relative max-w-md rounded-2xl px-4 py-3 shadow-lg ring-1 ring-black/5 backdrop-blur-sm ${
                  mine
                    ? "bg-gradient-to-br from-blue-500 to-indigo-500 text-white"
                    : "bg-slate-900/70 text-slate-100"
                }`}
              >
                <div className="mb-2 flex items-center gap-2 text-xs uppercase tracking-wide">
                  <span className="font-semibold">
                    {msg.senderDisplayName || msg.sender}
                  </span>
                  <span
                    className={`h-1.5 w-1.5 rounded-full ${
                      mine ? "bg-blue-200/80" : "bg-green-400/80"
                    }`}
                  ></span>
                  <span className="text-[11px] opacity-80">
                    {formatTimestamp(msg.createdAt)}
                  </span>
                </div>
                <p className="text-sm leading-relaxed">{msg.content}</p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
