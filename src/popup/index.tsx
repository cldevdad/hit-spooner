import React from "react";
import ReactDOM from "react-dom/client";
import Popup from "./Popup";

const rootElement = document.getElementById("popup-root");

if (rootElement) {
  const root = ReactDOM.createRoot(rootElement);
  root.render(<Popup />);
} else {
  console.error("Failed to find the root element for rendering the popup.");
}
