import React from "react";
import ReactDOM from "react-dom/client";

// 后续 `/home`、`/memory` 等路径能工作，离不开它。
import { BrowserRouter } from "react-router-dom";

// 引入应用根组件。`App` 是整个 React 应用的顶层组件。
import App from "./app/App";

// 引入全局样式。本项目的 sidebar 宽度、footer 高度、页面布局样式都从这里进入应用。
import "./styles/index.css";

// - `createRoot(...)` 创建 React 渲染根。`render(...)` 把 React 组件放进去。
ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </React.StrictMode>,
);
