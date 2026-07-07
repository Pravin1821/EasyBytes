import React, { useMemo, useState } from "react";

const StatusDot = ({ online }) => (
  <span
    className={`inline-flex h-2.5 w-2.5 rounded-full ${
      online ? "bg-cyan shadow-[0_0_6px_theme(colors.cyan)]" : "bg-text-faint"
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
  const [newRoomName, setNewRoomName] = useState("");

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

  const onlineUsers = sortedPresence.filter((user) => user.online);

  const handleCreateRoom = (event) => {
    event.preventDefault();
    const trimmed = newRoomName.trim();
    if (!trimmed) return;
    onCreateRoom(trimmed);
    setNewRoomName("");
  };

  return (
    <aside className="hidden w-72 flex-col gap-4 lg:flex">
      <div className="flex flex-1 flex-col rounded-2xl border border-border-subtle bg-bg-surface shadow-xl">
        <div className="border-b border-border-subtle px-5 py-4">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-semibold uppercase tracking-wide text-text-muted">
              Rooms
            </h2>
            <span className="rounded-full bg-bg-elevated px-3 py-1 text-xs text-text-muted">
              {rooms.length}
            </span>
          </div>
        </div>
        <div className="flex-1 overflow-y-auto px-2 py-3">
          {rooms.length === 0 ? (
            <p className="px-3 py-6 text-center text-sm text-text-muted">
              No rooms yet. Create one below to get started.
            </p>
          ) : (
            <ul className="flex flex-col gap-2">
              {rooms.map((room) => (
                <li key={room.id}>
                  <button
                    type="button"
                    onClick={() => onSelectRoom(room)}
                    className={`flex w-full items-center justify-between rounded-xl border px-4 py-3 text-left transition ${
                      currentRoom?.id === room.id
                        ? "border-ember/50 bg-ember-dim text-text-primary shadow-md shadow-ember/10"
                        : "border-transparent bg-transparent text-text-muted hover:border-border-subtle hover:bg-bg-elevated hover:text-text-primary"
                    }`}
                  >
                    <div>
                      <p className="text-sm font-semibold">#{room.name}</p>
                      <p className="font-mono text-[10px] uppercase tracking-wide text-text-faint">
                        room {room.id}
                      </p>
                    </div>
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>
        <form
          onSubmit={handleCreateRoom}
          className="border-t border-border-subtle px-5 py-4"
        >
          <label className="text-xs font-semibold uppercase tracking-wide text-text-muted">
            Create room
          </label>
          <div className="mt-2 flex items-center gap-2">
            <input
              type="text"
              value={newRoomName}
              onChange={(event) => setNewRoomName(event.target.value)}
              placeholder="e.g. design"
              className="w-full h-12 rounded-xl border border-border-subtle bg-bg-base px-4 text-sm text-text-primary outline-none transition placeholder:text-text-faint focus:border-ember"
            />
            <button
              type="submit"
              disabled={!newRoomName.trim()}
              className="inline-flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-ember text-bg-base font-semibold shadow-lg shadow-ember/20 transition hover:brightness-110 disabled:opacity-30 disabled:cursor-not-allowed"
              title="Add room"
            >
              +
            </button>
          </div>
        </form>
      </div>

      <div className="rounded-2xl border border-border-subtle bg-bg-surface shadow-xl">
        <div className="flex items-center justify-between border-b border-border-subtle px-5 py-4">
          <h2 className="text-sm font-semibold uppercase tracking-wide text-text-muted">
            Online
          </h2>
          <span className="font-mono text-xs text-cyan">{onlineUsers.length}</span>
        </div>
        <div className="max-h-56 overflow-y-auto px-3 py-3">
          {sortedPresence.length ? (
            <ul className="flex flex-col gap-1 text-sm">
              {sortedPresence.map((user) => (
                <li
                  key={user.username}
                  className="flex items-center justify-between rounded-lg px-3 py-2 transition hover:bg-bg-elevated"
                >
                  <div>
                    <p className="font-medium text-text-primary">
                      {user.displayName || user.username}
                    </p>
                    <p className="text-xs text-text-faint">{user.username}</p>
                  </div>
                  <StatusDot online={user.online} />
                </li>
              ))}
            </ul>
          ) : (
            <p className="px-3 py-4 text-sm text-text-muted">
              No presence information yet.
            </p>
          )}
        </div>
      </div>
    </aside>
  );
}