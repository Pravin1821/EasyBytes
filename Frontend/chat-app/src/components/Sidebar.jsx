import React, { useMemo, useState } from "react";

const StatusDot = ({ online }) => (
  <span
    className={`inline-flex h-2.5 w-2.5 rounded-full ${
      online ? "bg-emerald-400" : "bg-slate-600"
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
      <div className="flex flex-1 flex-col rounded-2xl border border-slate-800 bg-slate-900/60 shadow-xl">
        <div className="border-b border-slate-800 px-5 py-4">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-semibold uppercase tracking-wide text-slate-400">
              Rooms
            </h2>
            <span className="rounded-full bg-slate-800 px-3 py-1 text-xs text-slate-400">
              {rooms.length}
            </span>
          </div>
        </div>
        <div className="flex-1 overflow-y-auto px-2 py-3">
          <ul className="flex flex-col gap-2">
            {rooms.map((room) => (
              <li key={room.id}>
                <button
                  type="button"
                  onClick={() => onSelectRoom(room)}
                  className={`flex w-full items-center justify-between rounded-xl border px-4 py-3 text-left transition ${
                    currentRoom?.id === room.id
                      ? "border-blue-500/60 bg-blue-500/10 text-blue-100 shadow-md shadow-blue-500/30"
                      : "border-transparent bg-slate-900/50 text-slate-200 hover:border-slate-700 hover:bg-slate-900"
                  }`}
                >
                  <div>
                    <p className="text-sm font-semibold">#{room.name}</p>
                    <p className="text-[11px] uppercase tracking-wide text-slate-500">
                      Room ID {room.id}
                    </p>
                  </div>
                </button>
              </li>
            ))}
          </ul>
        </div>
        <form
          onSubmit={handleCreateRoom}
          className="border-t border-slate-800 px-5 py-4"
        >
          <label className="text-xs font-semibold uppercase tracking-wide text-slate-500">
            Create room
          </label>
          <div className="mt-2 flex items-center gap-2">
            <input
              type="text"
              value={newRoomName}
              onChange={(event) => setNewRoomName(event.target.value)}
              placeholder="e.g. design"
              className="w-full h-14 rounded-2xl border border-slate-700 bg-slate-950 px-4 text-base text-slate-100 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-500"
            />
            <button
              type="submit"
              className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-500 text-white shadow-lg"
              title="Add room"
            >
              +
            </button>
          </div>
        </form>
      </div>

      <div className="rounded-2xl border border-slate-800 bg-slate-900/60 shadow-xl">
        <div className="border-b border-slate-800 px-5 py-4">
          <h2 className="text-sm font-semibold uppercase tracking-wide text-slate-400">
            Online Users
          </h2>
        </div>
        <div className="max-h-56 overflow-y-auto px-5 py-3">
          {sortedPresence.length ? (
            <ul className="flex flex-col gap-2 text-sm text-slate-200">
              {sortedPresence.map((user) => (
                <li
                  key={user.username}
                  className="flex items-center justify-between rounded-lg bg-slate-900/60 px-3 py-2"
                >
                  <div>
                    <p className="font-medium">
                      {user.displayName || user.username}
                    </p>
                    <p className="text-xs text-slate-500">{user.username}</p>
                  </div>
                  <StatusDot online={user.online} />
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-sm text-slate-500">
              No presence information yet.
            </p>
          )}
        </div>
        <div className="border-t border-slate-800 px-5 py-3 text-xs text-slate-500">
          {onlineUsers.length} online
        </div>
      </div>
    </aside>
  );
}
