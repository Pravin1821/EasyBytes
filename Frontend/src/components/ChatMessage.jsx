import React, { useEffect, useRef, useState } from "react";

const formatTimestamp = (value) => {
  if (!value) return "";
  return new Date(value).toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
  });
};

function getLifePercent(createdAt, expiresAt) {
  if (!createdAt || !expiresAt) return null;
  const start = new Date(createdAt).getTime();
  const end = new Date(expiresAt).getTime();
  const now = Date.now();
  const total = end - start;
  if (total <= 0) return 0;
  const remaining = end - now;
  return Math.max(0, Math.min(100, (remaining / total) * 100));
}

export default function ChatMessage({ message, isMine }) {
  const barRef = useRef(null);
  const [isDying, setIsDying] = useState(false); // under 10% life left

  useEffect(() => {
    if (!message.createdAt || !message.expiresAt) return;

    const initialPercent = getLifePercent(message.createdAt, message.expiresAt);
    const end = new Date(message.expiresAt).getTime();
    const remainingMs = end - Date.now();

    if (barRef.current) {
      barRef.current.style.transition = "none";
      barRef.current.style.width = `${initialPercent}%`;
      void barRef.current.offsetWidth;
      barRef.current.style.transition = `width ${Math.max(remainingMs, 0)}ms linear`;
      barRef.current.style.width = "0%";
    }

    // Flip to "dying" state once under 10% life remains, so it can pulse.
    const tenPercentMs = remainingMs * 0.1;
    const dyingTimer = setTimeout(() => setIsDying(true), Math.max(remainingMs - tenPercentMs, 0));

    return () => clearTimeout(dyingTimer);
  }, [message.createdAt, message.expiresAt]);

  const hasExpiry = Boolean(message.createdAt && message.expiresAt);

  return (
    <div className={`flex w-full ${isMine ? "justify-end" : "justify-start"} gap-2.5 items-end animate-message-mount`}>
      {!isMine && (
        <div
          className="h-8 w-8 rounded-full bg-bg-elevated border border-border-subtle flex items-center justify-center font-display font-bold text-[10px] text-ember shrink-0 shadow-sm"
          title={message.senderDisplayName || message.sender}
        >
          {(message.senderDisplayName || message.sender).substring(0, 2).toUpperCase()}
        </div>
      )}

      <div className={`w-fit max-w-[80%] sm:max-w-md flex flex-col ${isMine ? "items-end" : "items-start"} gap-1`}>
        <div
          className={`relative px-4 py-2.5 shadow-sm transition-all duration-200 hover:shadow-md ${
            isMine
              ? "bg-ember text-bg-base rounded-2xl rounded-tr-none"
              : "bg-bg-elevated text-text-primary border border-border-subtle rounded-2xl rounded-tl-none"
          }`}
        >
          <div className="mb-1 flex items-center gap-2 text-[9px] uppercase tracking-wider font-bold">
            <span className={isMine ? "text-bg-base/90" : "text-text-muted"}>
              {message.senderDisplayName || message.sender}
            </span>
            <span
              className={`h-1 w-1 rounded-full ${
                isMine ? "bg-bg-base/30" : "bg-cyan"
              }`}
            ></span>
            <span className={`font-mono text-[9px] ${isMine ? "text-bg-base/50" : "text-text-faint"}`}>
              {formatTimestamp(message.createdAt)}
            </span>
          </div>

          <p className="text-sm leading-relaxed whitespace-pre-wrap break-words">{message.content}</p>
        </div>

        {hasExpiry && (
          <div
            className="h-[3px] w-full overflow-hidden rounded-full bg-border-subtle/30"
            title="Time until this message is permanently deleted"
          >
            <div
              ref={barRef}
              className={`h-full rounded-full bg-ember shadow-[0_0_6px_var(--color-ember)] ${isDying ? "animate-decay-pulse" : ""}`}
            />
          </div>
        )}
      </div>
    </div>
  );
}