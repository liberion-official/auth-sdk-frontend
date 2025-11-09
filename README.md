# Liberion ID Widget - Integration Guide

Liberion ID Widget is a modern authentication widget for web applications.

---

## Installation as NPM Package

Install the npm package:

```bash
npm i liberion-id-widget
```

### React Example with NPM Package

**Props:**

| Parameter    | Type       | Required | Description                                                        |
| ------------ | ---------- | -------- | ------------------------------------------------------------------ |
| `backendUrl` | `string`   | ✅       | WebSocket authentication server URL                                |
| `projectId`  | `string`   | ✅       | Your unique project identifier                                     |
| `isOpen`     | `boolean`  | ✅       | Controls widget visibility (true/false)                            |
| `theme`      | `string`   | ❌       | Theme mode: `'light'` or `'dark'` (default: `'dark'`)              |
| `successCb`  | `function` | ❌       | Callback function called on success. Receives authentication token |
| `failedCb`   | `function` | ❌       | Callback function called on error.                                 |
| `closeCb`    | `function` | ❌       | Callback function called when widget is closed                     |

Import the widget into your React application:

```jsx
import { useState } from "react";
import { LiberionIdWidget } from "liberion-id-widget";

function App() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <button onClick={() => setIsOpen(true)}>Login with Liberion ID</button>

      <LiberionIdWidget
        backendUrl="wss://your-backend-url.example.com"
        projectId="your-project-id"
        isOpen={isOpen}
        theme="light"
        closeCb={() => setIsOpen(false)}
        successCb={(token) => {
          console.log("Authentication successful, token:", token);
          localStorage.setItem("authToken", token);
        }}
        failedCb={(error) => {
          console.error("Authentication failed:", error);
        }}
      />
    </>
  );
}

export default App;
```

### React Example with script tag

```jsx
import React, { useState, useEffect } from "react";

const App = () => {
  const [isWidgetLoaded, setIsWidgetLoaded] = useState(false);
  const [token, setToken] = useState(null);

  // Load widget script
  useEffect(() => {
    const script = document.createElement("script");
    script.src = "https://example.com/lib/LiberionIdWidget.js";
    script.async = true;
    script.onload = () => setIsWidgetLoaded(true);
    document.body.appendChild(script);

    return () => {
      document.body.removeChild(script);
    };
  }, []);

  // Check for existing token
  useEffect(() => {
    const savedToken = localStorage.getItem("authToken");
    if (savedToken) {
      setToken(savedToken);
    }
  }, []);

  const handleLogin = () => {
    if (!isWidgetLoaded) return;

    window.LiberionIdWidget.setupLiberionId({
      backendUrl: "wss://your-backend-url.example.com",
      projectId: "your-project-id",
      successCb: (token) => {
        console.log("Authentication successful, token:", token);
        localStorage.setItem("authToken", token);
        setToken(token);
      },
      failedCb: (error) => {
        console.error("Authentication failed:", error);
      },
      closeCb: () => {
        console.log("Widget closed");
      },
      theme: "light",
    });
  };

  const handleLogout = () => {
    localStorage.removeItem("authToken");
    setToken(null);
  };

  if (!token) {
    return (
      <div>
        <h1>Welcome!</h1>
        <button onClick={handleLogin} disabled={!isWidgetLoaded}>
          {isWidgetLoaded ? "Login with Liberion ID" : "Loading..."}
        </button>
      </div>
    );
  }

  return (
    <div>
      <h1>You are authenticated!</h1>
      <p>Token: {token.substring(0, 20)}...</p>
      <button onClick={handleLogout}>Logout</button>
    </div>
  );
};

export default App;
```
