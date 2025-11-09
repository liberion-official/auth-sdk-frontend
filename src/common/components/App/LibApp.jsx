import { useEffect } from "react";
import {
  useRootContext,
  useThemeContext,
  useAuthContext,
} from "@/common/context";
import { Layout } from "@/common/layout/layout";
import { CALLBACKS, THEME_MODES } from "@/common/constants";
import Screens from "@/common/screens";

export default function LibApp({
  backendUrl,
  projectId,
  closeCb,
  successCb,
  failedCb,
  theme,
}) {
  const { setCallbacks } = useRootContext();
  const { setProjectId, setBackendUrl } = useAuthContext();
  const { setTheme } = useThemeContext();

  useEffect(() => {
    setProjectId(projectId);
    setBackendUrl(backendUrl);

    setCallbacks((s) => ({
      [CALLBACKS.close]: closeCb ?? s[CALLBACKS.close],
      [CALLBACKS.success]: successCb ?? s[CALLBACKS.success],
      [CALLBACKS.failed]: failedCb ?? s[CALLBACKS.failed],
    }));
  }, [
    closeCb,
    successCb,
    failedCb,
    backendUrl,
    projectId,
    setBackendUrl,
    setProjectId,
    setCallbacks,
  ]);

  useEffect(() => {
    if (theme && (theme === THEME_MODES.LIGHT || theme === THEME_MODES.DARK)) {
      setTheme(theme);
    }
  }, [theme, setTheme]);

  return (
    <Layout>
      <Screens />
    </Layout>
  );
}
