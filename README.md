# Liberion ID Widget - Integration Guide

Liberion ID Widget is a modern authentication widget for web applications.

## Installation

Include the widget script in your HTML:

```html
<script src="https://example.com/lib/LiberionIdWidget.js"></script>
```

## Vanilla JavaScript Example

```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Liberion ID - Vanilla JS</title>
  </head>
  <body>
    <h1>Welcome!</h1>
    <button onclick="handleLogin()">Login with Liberion ID</button>

    <script src="https://example.com/lib/LiberionIdWidget.js"></script>
    <script>
      const handleLogin = () => {
        LiberionIdWidget.setupLiberionId({
          backendUrl: "wss://your-backend-url.example.com",
          projectId: "your-project-id",
          successCb: (token) => {
            console.log("Authentication successful, token:", token);
            localStorage.setItem("authToken", token);
            window.location.href = "/dashboard";
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
    </script>
  </body>
</html>
```

---

## React Example

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

---

## API Reference

### `LiberionIdWidget.setupLiberionId(options)`

Initializes and displays the authentication widget.

**Parameters:**

| Parameter    | Type       | Required | Description                                                        |
| ------------ | ---------- | -------- | ------------------------------------------------------------------ |
| `backendUrl` | `string`   | ✅       | WebSocket authentication server URL                                |
| `projectId`  | `string`   | ✅       | Your unique project identifier                                     |
| `theme`      | `string`   | ❌       | Theme mode: `'light'` or `'dark'`                                  |
| `successCb`  | `function` | ❌       | Callback function called on success. Receives authentication token |
| `failedCb`   | `function` | ❌       | Callback function called on error. Receives error object           |
| `closeCb`    | `function` | ❌       | Callback function called when widget is closed                     |

**Example:**

```javascript
LiberionIdWidget.setupLiberionId({
  backendUrl: "wss://your-backend-url.example.com",
  projectId: "your-project-id",
  theme: "light",
  successCb: (token) => {
    localStorage.setItem("authToken", token);
  },
  failedCb: (error) => {
    console.error("Error:", error);
  },
});
```

### `LiberionIdWidget.closeLiberionId()`

Closes the widget.

```javascript
LiberionIdWidget.closeLiberionId();
```

---

## License

MIT © Liberion Inc.
