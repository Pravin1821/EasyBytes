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
    <div className={`flex ${isMine ? "justify-end" : "justify-start"}`}>
      <div
        className={`relative max-w-md overflow-hidden rounded-2xl px-4 py-3 shadow-lg ${
          isMine
            ? "bg-ember text-bg-base"
            : "bg-bg-elevated text-text-primary border border-border-subtle"
        }`}
      >
        <div className="mb-2 flex items-center gap-2 text-xs uppercase tracking-wide">
          <span className="font-semibold">
            {message.senderDisplayName || message.sender}
          </span>
          <span
            className={`h-1.5 w-1.5 rounded-full ${
              isMine ? "bg-bg-base/60" : "bg-cyan"
            }`}
          ></span>
          <span className={`font-mono text-[11px] ${isMine ? "opacity-70" : "text-text-faint"}`}>
            {formatTimestamp(message.createdAt)}
          </span>
        </div>

        <p className="text-sm leading-relaxed">{message.content}</p>

        {hasExpiry && (
          <div
            className={`mt-2 h-[3px] w-full overflow-hidden rounded-full ${
              isMine ? "bg-bg-base/20" : "bg-bg-base/40"
            }`}
            title="Time until this message is permanently deleted"
          >
            <div
              ref={barRef}
              className={`h-full rounded-full ${
                isMine ? "bg-bg-base/70" : "bg-ember"
              } ${isDying ? "animate-pulse" : ""}`}
            />
          </div>
        )}
      </div>
    </div>
  );
}