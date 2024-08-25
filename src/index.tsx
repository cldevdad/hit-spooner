import React from "react";
import ReactDOM from "react-dom/client";
import App from "./components/app/App";

const rootElement = document.createElement("div");
rootElement.id = "hitspooner-root";

document.body.prepend(rootElement);
document.title = "Hit Spooner - Mturk";

const root = ReactDOM.createRoot(rootElement);
root.render(<App />);
