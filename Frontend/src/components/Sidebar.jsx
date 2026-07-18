import React, { useMemo, useState } from "react";

const StatusDot = ({ online }) => (
  <span
    className={`inline-flex h-2 w-2 rounded-full transition-all duration-300 ${
      online
        ? "bg-cyan shadow-[0_0_8px_var(--color-cyan)]"
        : "bg-text-faint"
    }`}
  ></span>
);

export default function Sidebar({
  rooms,
  currentRoom,
  onSelectRoom,
  onCreateRoom,
  presence,
}) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [roomForm, setRoomForm] = useState({
    name: "",
    isPrivate: false,
    password: "",
    messageTtlSeconds: 86400, // 24h default
  });
  const [validationError, setValidationError] = useState("");

  const sortedPresence = useMemo(() => {
    const snapshot = Array.isArray(presence) ? [...presence] : [];
    return snapshot.sort((a, b) => {
      if (a.online === b.online) {
        return (a.displayName || a.username).localeCompare(
          b.displayName || b.username
        );
      }
      return a.online ? -1 : 1;
    });
  }, [presence]);

  const onlineCount = useMemo(() => {
    return sortedPresence.filter((u) => u.online).length;
  }, [sortedPresence]);

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setRoomForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setValidationError("");
    const trimmedName = roomForm.name.trim();

    if (!trimmedName) {
      setValidationError("Room name is required.");
      return;
    }
    if (trimmedName.length < 2 || trimmedName.length > 120) {
      setValidationError("Room name must be between 2 and 120 characters.");
      return;
    }
    if (roomForm.isPrivate && !roomForm.password.trim()) {
      setValidationError("Password is required for private rooms.");
      return;
    }

    onCreateRoom({
      name: trimmedName,
      isPrivate: roomForm.isPrivate,
      password: roomForm.isPrivate ? roomForm.password : "",
      messageTtlSeconds: Number(roomForm.messageTtlSeconds),
    });

    // Reset and close
    setRoomForm({
      name: "",
      isPrivate: false,
      password: "",
      messageTtlSeconds: 86400,
    });
    setIsModalOpen(false);
  };

  return (
    <aside className="flex flex-col gap-4 w-full h-full overflow-hidden">
      {/* Rooms Panel */}
      <div className="flex flex-1 flex-col rounded-2xl border border-border-subtle bg-bg-surface shadow-xl overflow-hidden min-h-0">
        <div className="border-b border-border-subtle px-5 py-4 flex items-center justify-between bg-bg-surface/50 backdrop-blur-md">
          <div className="flex items-center gap-2">
            <h2 className="text-xs font-semibold uppercase tracking-wider text-text-muted font-display">
              Rooms
            </h2>
            <span className="rounded-full bg-bg-elevated px-2.5 py-0.5 text-xs text-text-muted font-mono font-medium">
              {rooms.length}
            </span>
          </div>
          <button
            onClick={() => setIsModalOpen(true)}
            className="flex h-7 w-7 items-center justify-center rounded-lg bg-ember-dim border border-ember/20 text-ember transition hover:brightness-110"
            title="Create new room"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={2}
              stroke="currentColor"
              className="h-4 w-4"
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
            </svg>
          </button>
        </div>

        {/* Room List */}
        <div className="flex-1 overflow-y-auto px-2 py-3">
          {rooms.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full px-4 text-center">
              <p className="text-sm text-text-muted">No rooms yet.</p>
              <button
                onClick={() => setIsModalOpen(true)}
                className="mt-2 text-xs font-semibold text-ember hover:brightness-110"
              >
                Create one now
              </button>
            </div>
          ) : (
            <ul className="flex flex-col gap-1.5">
              {rooms.map((room) => {
                const isActive = currentRoom?.id === room.id;
                return (
                  <li key={room.id}>
                    <button
                      type="button"
                      onClick={() => onSelectRoom(room)}
                      className={`flex w-full items-center justify-between rounded-xl border px-4 py-3 text-left transition duration-200 ${
                        isActive
                          ? "border-ember/40 bg-ember-dim text-text-primary shadow-md shadow-ember/5"
                          : "border-transparent bg-transparent text-text-muted hover:border-border-subtle hover:bg-bg-hover hover:text-text-primary"
                      }`}
                    >
                      <div className="flex items-center gap-2 min-w-0">
                        <span className={`text-sm ${isActive ? "text-ember font-semibold" : "text-text-faint font-medium"}`}>
                          #
                        </span>
                        <p className="text-sm font-semibold truncate leading-none">
                          {room.name}
                        </p>
                        {room.isPrivate && (
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                            strokeWidth={2}
                            stroke="currentColor"
                            className="h-3.5 w-3.5 text-text-faint shrink-0"
                            title="Private password-protected room"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z"
                            />
                          </svg>
                        )}
                      </div>
                      <span className="font-mono text-[9px] uppercase tracking-wider text-text-faint bg-bg-base/40 px-1.5 py-0.5 rounded border border-border-subtle/50 shrink-0">
                        {room.messageTtlSeconds ? `${Math.round(room.messageTtlSeconds / 3600)}h` : "24h"}
                      </span>
                    </button>
                  </li>
                );
              })}
            </ul>
          )}
        </div>
      </div>

      {/* Presence Panel */}
      <div className="rounded-2xl border border-border-subtle bg-bg-surface shadow-xl flex flex-col overflow-hidden max-h-64">
        <div className="flex items-center justify-between border-b border-border-subtle px-5 py-4 bg-bg-surface/50 backdrop-blur-md">
          <h2 className="text-xs font-semibold uppercase tracking-wider text-text-muted font-display">
            Presence
          </h2>
          <div className="flex items-center gap-1.5 font-mono text-xs text-cyan font-semibold">
            <span className="h-1.5 w-1.5 rounded-full bg-cyan animate-pulse"></span>
            {onlineCount}
          </div>
        </div>
        <div className="overflow-y-auto px-3 py-3 flex-1">
          {sortedPresence.length ? (
            <ul className="flex flex-col gap-1 text-sm">
              {sortedPresence.map((u) => (
                <li
                  key={u.username}
                  className="flex items-center justify-between rounded-xl px-3 py-2 transition hover:bg-bg-hover"
                >
                  <div className="min-w-0 pr-2">
                    <p className="font-semibold text-text-primary text-sm truncate leading-none">
                      {u.displayName || u.username}
                    </p>
                    <p className="text-xs text-text-faint font-mono mt-1">
                      @{u.username}
                    </p>
                  </div>
                  <StatusDot online={u.online} />
                </li>
              ))}
            </ul>
          ) : (
            <p className="px-3 py-4 text-center text-xs text-text-muted">
              No presence details.
            </p>
          )}
        </div>
      </div>

      {/* Create Room Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-bg-base/80 backdrop-blur-sm"
            onClick={() => setIsModalOpen(false)}
          ></div>
          <div className="relative z-10 w-full max-w-md overflow-hidden rounded-2xl border border-border-subtle bg-bg-surface p-6 shadow-2xl animate-in fade-in zoom-in-95 duration-150">
            <h3 className="font-display text-xl font-semibold text-text-primary">
              Create temporary room
            </h3>
            <p className="text-xs text-text-muted mt-1 leading-relaxed">
              Create a new room. Active timers will automatically burn messages.
            </p>

            <form onSubmit={handleSubmit} className="mt-5 flex flex-col gap-4">
              {validationError && (
                <div className="rounded-xl border border-danger/30 bg-danger/10 px-4 py-3 text-xs text-danger">
                  {validationError}
                </div>
              )}

              <div className="flex flex-col gap-1.5">
                <span className="text-xs font-semibold uppercase tracking-wider text-text-muted">
                  Room Name
                </span>
                <input
                  required
                  type="text"
                  name="name"
                  value={roomForm.name}
                  onChange={handleInputChange}
                  placeholder="e.g. general-chat"
                  className="h-12 w-full rounded-xl border border-border-subtle bg-bg-base px-4 text-sm text-text-primary outline-none transition focus:border-ember"
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <span className="text-xs font-semibold uppercase tracking-wider text-text-muted">
                  Decay Lifespan (TTL)
                </span>
                <select
                  name="messageTtlSeconds"
                  value={roomForm.messageTtlSeconds}
                  onChange={handleInputChange}
                  className="h-12 w-full rounded-xl border border-border-subtle bg-bg-base px-4 text-sm text-text-primary outline-none transition focus:border-ember"
                >
                  <option value={3600}>1 Hour (Quick expire)</option>
                  <option value={86400}>24 Hours (Standard)</option>
                  <option value={604800}>7 Days (Extended)</option>
                </select>
              </div>

              <div className="flex items-center justify-between rounded-xl border border-border-subtle/50 bg-bg-base/30 p-3.5 mt-1">
                <div className="flex flex-col">
                  <span className="text-sm font-semibold text-text-primary">
                    Private Room
                  </span>
                  <span className="text-xs text-text-faint">
                    Require a password to enter
                  </span>
                </div>
                <input
                  type="checkbox"
                  name="isPrivate"
                  checked={roomForm.isPrivate}
                  onChange={handleInputChange}
                  className="h-5 w-5 rounded border-border-subtle bg-bg-base text-ember focus:ring-ember cursor-pointer"
                />
              </div>

              {roomForm.isPrivate && (
                <div className="flex flex-col gap-1.5 animate-in slide-in-from-top-2 duration-150">
                  <span className="text-xs font-semibold uppercase tracking-wider text-text-muted">
                    Room Password
                  </span>
                  <input
                    required
                    type="password"
                    name="password"
                    value={roomForm.password}
                    onChange={handleInputChange}
                    placeholder="Enter room password"
                    className="h-12 w-full rounded-xl border border-border-subtle bg-bg-base px-4 text-sm text-text-primary outline-none transition focus:border-ember"
                  />
                </div>
              )}

              <div className="mt-4 flex gap-3 justify-end">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="h-12 px-4 rounded-xl text-sm font-semibold text-text-muted hover:text-text-primary transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="h-12 px-5 rounded-xl bg-ember text-sm font-semibold text-bg-base shadow-lg shadow-ember/15 transition hover:brightness-110"
                >
                  Create
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </aside>
  );
}