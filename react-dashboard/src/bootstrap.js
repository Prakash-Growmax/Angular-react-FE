// src/bootstrap.js - Create this file
import React from "react";
import { createRoot } from "react-dom/client";
import App from "./App";

// Keep track of root instance to avoid duplicate creation
let root;

// This bootstrap file is the actual entry point that gets executed
// once all the shared dependencies are loaded
const mount = () => {
  const rootElement = document.getElementById("root");

  if (!root && rootElement) {
    // Only create root if it doesn't exist yet
    root = createRoot(rootElement);
  }

  if (root) {
    root.render(<App />);
  }
};

// Check if we're in development standalone mode
if (process.env.NODE_ENV === "development") {
  // If the container div exists, we're probably running in isolation
  const rootElement = document.getElementById("root");
  if (rootElement) {
    mount();
  }
}

// Export mount function for container apps to use
export { mount };
