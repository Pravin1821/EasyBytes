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
      className="border-t border-border-subtle bg-bg-surface px-6 py-4"
    >
      <div className="mx-auto flex w-full max-w-3xl items-end gap-3">
        <div className="flex-1 rounded-2xl border border-border-subtle bg-bg-base px-6 py-4 transition focus-within:border-ember/60 focus-within:ring-1 focus-within:ring-ember/20">
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
            className="h-14 max-h-40 w-full resize-none bg-transparent text-base text-text-primary outline-none placeholder:text-text-faint"
          />
        </div>
        <button
          type="submit"
          disabled={disabled || !text.trim()}
          className="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-ember text-bg-base shadow-lg shadow-ember/20 transition hover:brightness-110 disabled:cursor-not-allowed disabled:bg-bg-elevated disabled:text-text-faint disabled:shadow-none"
        >
          <span className="sr-only">Send</span>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.8}
            stroke="currentColor"
            className="h-5 w-5"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M6 12 18 6l-4 6 4 6-12-6Z"
            />
          </svg>
        </button>
      </div>
    </form>
  );
}

MessageInput.defaultProps = {
  disabled: false,
};