import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { Client } from "@stomp/stompjs";
import SockJS from "sockjs-client";
import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";
import ChatRoom from "../components/ChatRoom";
import MessageInput from "../components/MessageInput";
import { useAuth } from "../context/AuthContext";
import api from "../services/api";

const WS_ENDPOINT =
  import.meta.env.VITE_WS_URL ?? "http://localhost:5000/ws";

export default function ChatPage() {
  const { user } = useAuth();
  const [rooms, setRooms] = useState([]);
  const [currentRoom, setCurrentRoom] = useState(null);
  const [messages, setMessages] = useState([]);
  const [presence, setPresence] = useState([]);
  const [connectionState, setConnectionState] = useState("disconnected");
  const [typingUsers, setTypingUsers] = useState({});

  const clientRef = useRef(null);
  const roomSubscriptionRef = useRef(null);
  const typingSubscriptionRef = useRef(null);
  const presenceSubscriptionRef = useRef(null);
  const typingTimeoutRef = useRef(null);

  const roomId = currentRoom?.id;

  const joinableRooms = useMemo(
    () =>
      rooms.map((room) => ({
        ...room,
        active: room.id === roomId,
      })),
    [rooms, roomId]
  );

  const loadRoomMessages = useCallback(async (id) => {
    try {
      const res = await api.get(`/messages/rooms/${id}`, {
        params: { limit: 100 },
      });
      setMessages(res.data || []);
    } catch (error) {
      console.error("Failed to load messages", error);
    }
  }, []);

  useEffect(() => {
    fetchRooms();
    fetchPresence();
  }, []);

  useEffect(() => {
    if (!user) return;

    setConnectionState("connecting");

    const client = new Client({
      reconnectDelay: 5000,
      debug: import.meta.env.DEV ? (msg) => console.debug("[stomp]", msg) : () => {},
      connectHeaders: {
        username: user.username,
      },
      webSocketFactory: () => new SockJS(`${WS_ENDPOINT}?username=${user.username}`),
    });

    client.onConnect = () => {
      setConnectionState("connected");
      subscribePresence(client);
      if (roomId) {
        subscribeRoom(client, roomId);
      }
    };

    client.onStompError = (frame) => {
      console.error("Broker reported error:", frame.headers["message"]);
      setConnectionState("error");
    };

    client.onWebSocketClose = () => {
      setConnectionState("disconnected");
    };

    client.activate();
    clientRef.current = client;

    return () => {
      unsubscribeCurrentRoom();
      if (presenceSubscriptionRef.current) {
        presenceSubscriptionRef.current.unsubscribe();
        presenceSubscriptionRef.current = null;
      }
      client.deactivate();
      clientRef.current = null;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

  useEffect(() => {
    return () => {
      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current);
      }
    };
  }, []);

  useEffect(() => {
    if (!roomId) {
      setMessages([]);
      return;
    }
    setMessages([]);
    loadRoomMessages(roomId);
    if (clientRef.current?.connected) {
      subscribeRoom(clientRef.current, roomId);
    }
  }, [roomId, loadRoomMessages]);

  useEffect(() => {
    const interval = setInterval(() => {
      setTypingUsers((current) => {
        const now = Date.now();
        const next = { ...current };
        let changed = false;
        Object.entries(next).forEach(([username, expiration]) => {
          if (expiration < now) {
            delete next[username];
            changed = true;
          }
        });
        return changed ? next : current;
      });
    }, 1500);
    return () => clearInterval(interval);
  }, []);

  const fetchRooms = async () => {
    try {
      const res = await api.get("/rooms");
      const fetchedRooms = res.data || [];
      setRooms(fetchedRooms);
      if (fetchedRooms.length && !currentRoom) {
        setCurrentRoom(fetchedRooms[0]);
      }
    } catch (error) {
      console.error("Failed to load rooms", error);
    }
  };

  const fetchPresence = async () => {
    try {
      const res = await api.get("/presence");
      setPresence(res.data || []);
    } catch (error) {
      console.warn("Failed to load presence snapshot", error);
    }
  };

  const subscribePresence = (client) => {
    if (presenceSubscriptionRef.current) return;
    presenceSubscriptionRef.current = client.subscribe(
      "/topic/presence",
      (message) => {
        try {
          const payload = JSON.parse(message.body);
          setPresence(payload);
        } catch (error) {
          console.error("Failed to parse presence payload", error);
        }
      }
    );
  };

  const handleIncomingMessage = useCallback((payload) => {
    setMessages((prev) =>
      [...prev, payload].sort(
        (a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
      )
    );
    setTypingUsers((current) => {
      if (!payload.sender) return current;
      const next = { ...current };
      delete next[payload.sender];
      return next;
    });
  }, []);

  const handleTypingEvent = useCallback((payload) => {
    setTypingUsers((current) => {
      const next = { ...current };
      if (payload.typing) {
        next[payload.username] = Date.now() + 2500;
      } else {
        delete next[payload.username];
      }
      return next;
    });
  }, []);

  const subscribeRoom = (client, id) => {
    unsubscribeCurrentRoom();
    roomSubscriptionRef.current = client.subscribe(`/topic/rooms/${id}`, (message) => {
      try {
        const payload = JSON.parse(message.body);
        handleIncomingMessage(payload);
      } catch (error) {
        console.error("Failed to parse message payload", error);
      }
    });
    typingSubscriptionRef.current = client.subscribe(`/topic/rooms/${id}/typing`, (message) => {
      try {
        const payload = JSON.parse(message.body);
        handleTypingEvent(payload);
      } catch (error) {
        console.error("Failed to parse typing payload", error);
      }
    });
  };

  const unsubscribeCurrentRoom = () => {
    if (roomSubscriptionRef.current) {
      roomSubscriptionRef.current.unsubscribe();
      roomSubscriptionRef.current = null;
    }
    if (typingSubscriptionRef.current) {
      typingSubscriptionRef.current.unsubscribe();
      typingSubscriptionRef.current = null;
    }
  };

  const handleCreateRoom = async (name) => {
    try {
      const res = await api.post("/rooms", { name });
      const newRoom = res.data;
      setRooms((prev) => [...prev, newRoom]);
      setCurrentRoom(newRoom);
    } catch (error) {
      console.error("Failed to create room", error);
    }
  };

  const handleSendMessage = (text) => {
    if (!roomId || !clientRef.current?.connected) return;
    clientRef.current.publish({
      destination: `/app/rooms/${roomId}`,
      body: JSON.stringify({
        sender: user.username,
        content: text,
      }),
    });
    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
      typingTimeoutRef.current = null;
    }
  };

  const emitTyping = useMemo(() => {
    let lastSent = 0;
    return () => {
      if (!roomId || !clientRef.current?.connected) return;
      const now = Date.now();
      if (now - lastSent > 800) {
        clientRef.current.publish({
          destination: `/app/rooms/${roomId}/typing`,
          body: JSON.stringify({
            roomId: String(roomId),
            username: user.username,
            typing: true,
          }),
        });
        lastSent = now;
      }
      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current);
      }
      typingTimeoutRef.current = setTimeout(() => {
        if (!clientRef.current?.connected) return;
        clientRef.current.publish({
          destination: `/app/rooms/${roomId}/typing`,
          body: JSON.stringify({
            roomId: String(roomId),
            username: user.username,
            typing: false,
          }),
        });
      }, 2000);
    };
  }, [roomId, user?.username]);

  const activeTyping = useMemo(
    () =>
      Object.keys(typingUsers).filter(
        (username) =>
          username !== user?.username && typingUsers[username] > Date.now()
      ),
    [typingUsers, user?.username]
  );

  return (
    <div className="flex h-screen flex-col bg-slate-950 text-slate-100">
      <Navbar />
      <div className="mx-auto flex w-full max-w-6xl flex-1 gap-4 px-4 py-6 lg:px-6">
        <Sidebar
          rooms={joinableRooms}
          currentRoom={currentRoom}
          onSelectRoom={setCurrentRoom}
          onCreateRoom={handleCreateRoom}
          presence={presence}
        />
        <div className="flex min-h-0 flex-1 flex-col overflow-hidden rounded-2xl border border-slate-800 bg-gradient-to-b from-slate-900/60 to-slate-950 shadow-xl">
          <div className="border-b border-slate-800 px-4 py-3 lg:hidden">
            <label className="text-xs font-semibold uppercase tracking-wide text-slate-500">
              Room
            </label>
            <select
              value={currentRoom ? String(currentRoom.id) : ""}
              onChange={(event) => {
                const next = rooms.find(
                  (room) => String(room.id) === event.target.value
                );
                if (next) setCurrentRoom(next);
              }}
                className="mt-2 w-full h-14 rounded-2xl border border-slate-800 bg-slate-900 px-4 text-base text-slate-100 outline-none"
            >
              <option value="" disabled>
                Select a room
              </option>
              {rooms.map((room) => (
                <option key={room.id} value={String(room.id)}>
                  #{room.name}
                </option>
              ))}
            </select>
          </div>
          <div className="flex items-center justify-between border-b border-slate-800 px-6 py-4">
            <div>
              <p className="text-lg font-semibold text-slate-100">
                #{currentRoom?.name ?? "Select a room"}
              </p>
              {roomId && (
                <p className="text-xs font-medium uppercase tracking-wide text-slate-500">
                  {connectionState === "connected"
                    ? "Connected"
                    : connectionState === "error"
                    ? "Reconnecting…"
                    : connectionState === "connecting"
                    ? "Connecting…"
                    : "Waiting for connection"}
                </p>
              )}
            </div>
            {activeTyping.length > 0 && (
              <div className="flex items-center gap-2 rounded-full bg-slate-800/80 px-3 py-1 text-xs text-slate-300">
                <span className="relative flex h-2 w-2">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-blue-400 opacity-75" />
                  <span className="relative inline-flex h-2 w-2 rounded-full bg-blue-400" />
                </span>
                {activeTyping.join(", ")} typing…
              </div>
            )}
          </div>
          <ChatRoom messages={messages} currentUser={user} />
          <MessageInput
            onSend={handleSendMessage}
            onTyping={emitTyping}
            disabled={!roomId || connectionState !== "connected"}
          />
        </div>
      </div>
    </div>
  );
}
