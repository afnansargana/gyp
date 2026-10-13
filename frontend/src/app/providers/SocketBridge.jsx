import { useEffect } from "react";
import { getSocket } from "../../lib/socket";
import { useAuthStore } from "../../store/useAuthStore";
import { useNotificationStore } from "../../store/useNotificationStore";
import { notify } from "../../Components/ui";

export function SocketBridge() {
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  const role = useAuthStore((s) => s.role);
  const userId = useAuthStore((s) => s.userId);
  const push = useNotificationStore((s) => s.push);

  useEffect(() => {
    if (!isAuthenticated) return undefined;
    const socket = getSocket();
    socket.connect();

    const rooms = [];
    if (role === "admin") rooms.push("admin", "staff");
    if (role === "mechanic") {
      rooms.push("staff", `mechanic-${userId}`);
    }
    rooms.forEach((room) => socket.emit("join-room", room));

    const onNotice = (payload) => {
      push(payload);
      notify.info(payload.title || "Update", payload.message);
    };
    socket.on("notification", onNotice);

    return () => {
      socket.off("notification", onNotice);
      socket.disconnect();
    };
  }, [isAuthenticated, role, userId, push]);

  return null;
}

export default SocketBridge;
