import React, { useState } from "react";

const keyIsEnter = (event) =>
  event.key === "Enter" && !event.shiftKey && !event.isComposing;

export default function MessageInput({ onSend, onTyping, disabled }) {
  const [text, setText] = useState("");

  const emitTyping = () => {
    if (typeof onTyping === "function") {
      onTyping();
    }
  };

  const submitMessage = () => {
    const trimmed = text.trim();
    if (!trimmed) return;
    onSend(trimmed);
    setText("");
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    if (disabled) return;
    submitMessage();
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="border-t border-slate-800 bg-slate-950/80 px-6 py-4 backdrop-blur"
    >
      <div className="mx-auto flex w-full max-w-3xl items-end gap-3">
        <div className="flex-1 rounded-2xl border border-slate-800 bg-slate-900/70 px-6 py-4 shadow-inner ring-1 ring-black/5 focus-within:border-blue-500/60 focus-within:ring-blue-500/20">
          <textarea
            rows={1}
            value={text}
            disabled={disabled}
            onChange={(event) => {
              setText(event.target.value);
              emitTyping();
            }}
            onKeyDown={(event) => {
              if (keyIsEnter(event)) {
                event.preventDefault();
                if (!disabled) {
                  submitMessage();
                }
              }
            }}
            placeholder={
              disabled
                ? "Connecting to the room…"
                : "Type a message and press Enter"
            }
            className="h-14 max-h-40 w-full resize-none bg-transparent text-base text-slate-100 outline-none placeholder:text-slate-500"
          />
        </div>
        <button
          type="submit"
          disabled={disabled || !text.trim()}
          className="inline-flex h-11 w-11 items-center justify-center rounded-full bg-gradient-to-r from-blue-500 to-indigo-500 text-white shadow-lg transition hover:from-blue-400 hover:to-indigo-400 disabled:cursor-not-allowed disabled:bg-slate-700 disabled:text-slate-400"
        >
          <span className="sr-only">Send</span>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            className="h-5 w-5"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="m6 12 3.23 3.23a.75.75 0 0 0 1.06 0L18 7.5"
            />
          </svg>
        </button>
      </div>
    </form>
  );
}
