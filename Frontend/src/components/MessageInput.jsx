import React, { useState } from "react";

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
      className="border-t border-border-subtle bg-bg-surface px-4 py-4 sm:px-6"
    >
      <div className="mx-auto flex w-full max-w-3xl items-center gap-3">
        <div className="flex-1 flex items-center rounded-2xl border border-border-subtle bg-bg-base px-4 py-3 transition duration-200 focus-within:border-ember focus-within:ring-2 focus-within:ring-ember/10">
          <textarea
            rows={1}
            value={text}
            disabled={disabled}
            onChange={(event) => {
              setText(event.target.value);
              emitTyping();
            }}
            onKeyDown={(event) => {
              if (event.key === "Enter" && !event.shiftKey && !event.isComposing) {
                event.preventDefault();
                if (!disabled) {
                  submitMessage();
                }
              }
            }}
            placeholder={
              disabled
                ? "Connecting to the room…"
                : "Type a message... (Shift+Enter for newline)"
            }
            className="flex-1 w-full min-h-[20px] max-h-24 resize-none bg-transparent text-sm text-text-primary outline-none placeholder:text-text-faint py-0.5 leading-relaxed"
          />
        </div>
        <button
          type="submit"
          disabled={disabled || !text.trim()}
          className="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-ember text-bg-base shadow-lg shadow-ember/15 transition hover:brightness-110 disabled:cursor-not-allowed disabled:bg-bg-elevated disabled:text-text-faint disabled:shadow-none"
        >
          <span className="sr-only">Send</span>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={2}
            stroke="currentColor"
            className="h-5 w-5"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M6 12L18 6l-4 6 4 6-12-6z"
            />
          </svg>
        </button>
      </div>
    </form>
  );
}