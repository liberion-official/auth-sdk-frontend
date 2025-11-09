import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import { CALLBACKS, AUTH_STATUSES, SOCKET_MESSAGES } from "@/common/constants";
import { log } from "@/common/utils";
import { EnfaceSocket } from "@/common/socket";
import { useRootContext } from "./root";

const AuthContext = createContext();

export const useAuthContext = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [backendUrl, setBackendUrl] = useState();
  const [projectId, setProjectId] = useState();
  const [link, setLink] = useState("");
  const [authStatus, setAuthStatus] = useState(AUTH_STATUSES.default);

  const socketRef = useRef(null);

  const { callbacks, setClosing } = useRootContext();

  const initializeSocket = useCallback(
    async (url) => {
      const socket = new EnfaceSocket({
        address: url,
        onClose: (event) => {
          log("WebSocket closed:", event);
        },
        onMessage: (json) => {
          if (json?._ === SOCKET_MESSAGES.ACTIVATED) {
            setAuthStatus(AUTH_STATUSES.awaiting);
          }

          if (json?._ === SOCKET_MESSAGES.ERROR) {
            setAuthStatus(AUTH_STATUSES.error);
            callbacks[CALLBACKS.failed]?.();
          }

          if (json?.message === SOCKET_MESSAGES.AUTH_DECLINED) {
            setAuthStatus(AUTH_STATUSES.cancel);
            callbacks[CALLBACKS.failed]?.();
          }

          if (json?.message === SOCKET_MESSAGES.AUTH_TIMEOUT) {
            setAuthStatus(AUTH_STATUSES.timeout);
            setClosing(true);
            callbacks[CALLBACKS.failed]?.();
          }

          if (json?.message === SOCKET_MESSAGES.WELCOME) {
            callbacks[CALLBACKS.success]?.({
              token: json.payload.token,
            });
            setAuthStatus(AUTH_STATUSES.success);
            setClosing(true);
          }
        },
      });

      try {
        await socket.open();

        const msg = await socket.send({ _: SOCKET_MESSAGES.AUTH_INIT });
        if (msg?._ === SOCKET_MESSAGES.AUTH_INIT && msg?.linkWeb) {
          setLink(msg.linkWeb);
        }

        socketRef.current = socket;
      } catch (err) {
        log("WS init/auth error:", err);

        setAuthStatus(AUTH_STATUSES.error);
        setClosing(true);

        try {
          socket.close();
        } catch (closeError) {
          log("[initializeSocket] socket close failed", closeError);
        }
      }
    },
    [callbacks, setClosing]
  );

  useEffect(() => {
    if (backendUrl && projectId) {
      initializeSocket(backendUrl);
    }

    return () => socketRef.current?.close();
  }, [backendUrl, projectId, initializeSocket]);

  const contextValue = {
    setProjectId,
    setBackendUrl,
    authStatus,
    link,
  };

  return (
    <AuthContext.Provider value={contextValue}>{children}</AuthContext.Provider>
  );
};
