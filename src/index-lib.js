import { createRoot } from "react-dom/client";
import { WIDGET_SCRIPT_ID } from "@/common/constants";
import Providers from "@/common/context/providers";
import LibApp from "@/common/components/App/LibApp";
import { logError } from "@/common/utils";
import "@/common/i18n";

let root = null;
let container = null;
let externalCloseCb = null;

export const closeLiberionId = () => {
  if (root) {
    try {
      root.unmount();
    } catch (error) {
      logError("[closeLiberionId] unmount failed", error);
    }
    root = null;
  }
  if (container?.parentNode) {
    container.parentNode.removeChild(container);
  }
  container = null;

  if (typeof externalCloseCb === "function") {
    try {
      externalCloseCb();
    } catch (error) {
      logError("[closeLiberionId] external close callback failed", error);
    }
  }
  externalCloseCb = null;
};

export const setupLiberionId = ({
  backendUrl,
  projectId,
  successCb,
  closeCb,
  failedCb,
  theme,
}) => {
  if (container || root) closeLiberionId();

  container = document.createElement("div");
  container.id = WIDGET_SCRIPT_ID;
  document.body.appendChild(container);

  root = createRoot(container);
  externalCloseCb = closeCb;

  const teardown = () => closeLiberionId();

  root.render(
    <Providers>
      <LibApp
        backendUrl={backendUrl}
        projectId={projectId}
        successCb={successCb}
        failedCb={failedCb}
        closeCb={teardown}
        theme={theme}
      />
    </Providers>
  );
};
