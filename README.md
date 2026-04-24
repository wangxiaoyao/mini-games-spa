# mini-games-spa

> A small React single page application for COMP6080-style mini games.

## 项目概述

本项目需要构建一个小型单页面应用程序（SPA），包含：

- 一个主页仪表盘（Dashboard）
- 三个基础互动游戏：
  - Operation Blanks
  - Flashing Memory Game
  - Space Invaders
- 一个跨页面共享的胜利计数器
- 固定右侧边栏、固定底部页脚和响应式布局

应用没有后端服务。除首次读取远程初始分数外，所有运行状态都应由浏览器端管理，并通过 `localStorage` 实现持久化。

## 技术选型

### 构建工具：Vite

使用 Vite 替代 CRA。

原因：

- CRA 已不再适合作为新项目默认选择。
- Vite 启动快、配置少，适合轻量 SPA。
- 与 React、Tailwind CSS、React Router 集成简单。

### 框架：React

React 适合本项目的原因：

- 页面由多个状态驱动的交互组件组成。
- 三个游戏都有独立 UI 状态和事件流程。
- Dashboard、Sidebar 和游戏页面需要共享“剩余获胜次数”。
- 使用组件化可以清晰拆分布局、全局状态和各游戏逻辑。

### 路由：React Router

项目需要以下固定路由：

- `/home`
- `/operations`
- `/memory`
- `/space`

建议使用 React Router 管理页面切换，并在根路由或未知路径中重定向到 `/home`。

### 状态管理：React Context + Local State

只建议把真正跨页面共享的状态放入 React Context。

全局 Context 负责：

- `initialScore`：从远程 JSON 获取的原始分数
- `gamesLeft`：当前剩余胜利次数
- `decrementGamesLeft()`：任意游戏胜利后减少计数
- `resetGamesLeft()`：重置为原始分数
- `isLoadingInitialScore`：初始分数加载状态

每个游戏自己的状态不要放进 Context，应保留在对应页面或自定义 hook 中。

例如：

- Operations 当前题目、当前数字组索引
- Memory 当前轮次、展示序列、用户输入位置、计时器状态
- Space shooter 位置、剩余目标方块、键盘事件

### 持久化：localStorage

需求要求胜利计数器跨页面和刷新后保持。

推荐规则：

1. 首次加载时请求远程 JSON：
   `https://cs6080.web.cse.unsw.edu.au/raw/data/score.json`
2. 如果本地没有已保存的 `gamesLeft`，使用远程 `score` 初始化。
3. 如果本地已有 `gamesLeft`，优先使用本地值。
4. 点击 `(reset)` 时，恢复到远程 `score` 的原始值。
5. 如果远程请求失败，可以 fallback 到 `5`，但实现中应保持逻辑清晰。

### 样式：Tailwind CSS + 少量全局 CSS

Tailwind CSS 可用于快速实现布局、间距和响应式规则。

不过本项目包含多个精确尺寸：

- sidebar：`100px` / `60px` / `30px`
- footer：`50px`
- logo：`50px x 50px`
- space game window：`500px x 500px`

建议在全局 CSS 中定义布局变量，避免 sidebar 和 footer 宽度计算不一致：

```css
:root {
  --sidebar-width: 100px;
  --footer-height: 50px;
}

@media (max-width: 1399px) {
  :root {
    --sidebar-width: 60px;
  }
}

@media (max-width: 799px) {
  :root {
    --sidebar-width: 30px;
  }
}
```

### 包管理：Yarn

使用 Yarn 安装和运行项目：

```bash
yarn install
yarn dev
```

如果需要与原始考试脚本保持一致，也可以在 `package.json` 中提供：

```json
{
  "scripts": {
    "start": "vite",
    "dev": "vite",
    "build": "vite build",
    "preview": "vite preview"
  }
}
```

## 推荐项目结构

建议按功能模块组织，而不是只按 `pages` 和 `components` 粗分。

```txt
src/
├── app/
│   ├── App.jsx
│   └── router.jsx
├── layout/
│   ├── AppLayout.jsx
│   ├── Sidebar.jsx
│   └── Footer.jsx
├── features/
│   ├── score/
│   │   ├── ScoreProvider.jsx
│   │   ├── useScore.js
│   │   └── scoreApi.js
│   ├── operations/
│   │   ├── OperationsPage.jsx
│   │   ├── useOperationsGame.js
│   │   └── numbers.js
│   ├── memory/
│   │   ├── MemoryPage.jsx
│   │   └── useMemoryGame.js
│   └── space/
│       ├── SpacePage.jsx
│       └── useSpaceGame.js
├── shared/
│   └── hooks/
│       └── useLocalStorage.js
├── styles/
│   └── index.css
└── main.jsx
```

### 结构说明

`app/`

- 放应用入口组件和路由配置。
- `App.jsx` 负责挂载 Provider、Router 和全局布局。

`layout/`

- 只放跨页面布局组件。
- `Sidebar`、`Footer`、`AppLayout` 不应包含具体游戏逻辑。

`features/score/`

- 管理跨页面共享的胜利计数。
- 负责远程 score 获取、localStorage 持久化、reset 和 decrement。

`features/operations/`

- 管理 Operation Blanks 页面和规则。
- 题目数据可以放在 `numbers.js`。

`features/memory/`

- 管理 Memory Game 的轮次、展示序列、按钮禁用和计时器。

`features/space/`

- 管理 Space Invaders 的固定画布区域、键盘输入、目标消除和重置。

`shared/`

- 只放真正通用的工具和 hook。
- 不要把业务专用逻辑放进 `shared`。

`styles/`

- 放全局 CSS、Tailwind 入口和布局变量。

## 功能需求

### 1. 文档、侧边栏和页脚

整体页面：

- `body` 和根页面 margin 必须为 `0px`。
- 除 sidebar 和 footer 外的区域称为 `main body`。
- Dashboard 和三个游戏页面都应占据完整 `main body`。

侧边栏：

- 位于页面右侧。
- 宽度默认 `100px`。
- 高度占满整个 viewport。
- `position: fixed`。
- 背景颜色为 `#eee`。
- 顶部居中展示 logo：
  - 可以使用任意图片。
  - 上下 margin 为 `15px`。
  - 尺寸为 `50px x 50px`。
- 包含 4 个链接：
  - Home -> `/home`
  - Operations -> `/operations`
  - Memory -> `/memory`
  - Space -> `/space`

响应式规则：

- viewport 宽度 `< 1400px`：
  - sidebar 宽度变为 `60px`。
  - 链接文本变为 `H`、`Op`、`Me`、`S`。
- viewport 宽度 `< 800px`：
  - sidebar 宽度变为 `30px`。
  - 链接文本保持 `H`、`Op`、`Me`、`S`。
  - logo 隐藏。

页脚：

- 高度 `50px`。
- 始终位于页面底部。
- 宽度为 viewport 宽度减去 sidebar 宽度。
- 背景颜色为 `#999`。
- 不包含任何内容。

### 2. Dashboard

路由：`/home`

内容：

- 两行水平居中文本。
- 第一行：
  - 文案：`Please choose an option from the sidebar.`
  - 颜色：`blue`
  - 字号：`2em`
- 第二行：
  - 文案：`Games left to win: X (reset)`
  - `X` 为当前剩余胜利次数。
  - `(reset)` 是按钮。

胜利计数规则：

- `X` 初始值来自：
  `https://cs6080.web.cse.unsw.edu.au/raw/data/score.json`
- JSON 格式为：

```json
{
  "score": 5
}
```

- 每赢得任意一个游戏，`X` 减少 1。
- `X` 使用 `localStorage` 持久化。
- 当 `X` 到达 0 时，导航到 `/home` 时弹出：
  `Congratulations!`
- 弹出后重置为原始 score。
- 点击 `(reset)` 按钮时，立即重置为原始 score。

### 3. Game 1 - Operation Blanks

路由：`/operations`

布局：

- 主区域包含一个主方框。
- 方框高度 `100px`。
- 方框宽度 `100%`。
- 方框在 main body 中垂直居中。
- 背景颜色为 `rgb(200,255,255)`。
- 方框内包含 5 个等距区域：
  - 输入数字 1
  - 4 个运算按钮：`+`、`-`、`x`、`÷`
  - 输入数字 2
  - `=`
  - 输出结果数字

玩法：

- 游戏开始时展示一组数字。
- 用户点击一个运算按钮。
- 如果公式成立，弹出胜利提示，并进入下一组数字。
- 如果公式不成立，弹出错误提示，允许继续重试。
- 每次获胜后需要调用 `decrementGamesLeft()`。
- 至少提供 5 组不同数字；5 组展示完后可以循环。

可使用的数据：

```js
export const operationNumbers = [
  [1, 2, 2],
  [3, 6, -3],
  [8, 3, 11],
  [9, 8, 17],
  [5, 4, 9],
];
```

### 4. Game 2 - Flashing Memory Game

路由：`/memory`

布局：

- main body 上半部分包含 4 个等宽按钮。
- 按钮文本分别为 `A`、`B`、`C`、`D`。
- 这 4 个按钮区域高度占 main body 的一半。
- 下半部分包含一个居中的 instruction box：
  - 尺寸 `20px x 20px`
  - 背景颜色 `#cccccc`
  - 无边框

流程：

1. 页面 mount 后游戏立即开始。
2. 禁用上半部分 4 个按钮。
3. instruction box 随机显示一个字符，字符来自 `A`、`B`、`C`、`D`。
4. 每个字符显示 1 秒后消失。
5. 当前轮次为 `X` 时，重复显示 `X` 个随机字符。
6. 展示结束后重新启用按钮。
7. 用户必须按正确顺序点击 `X` 个按钮。
8. 如果顺序正确，进入下一轮，`X + 1`。
9. 如果顺序错误，弹出失败提示，并从第一轮重新开始。
10. 成功完成 `X = 5` 的轮次时，弹出胜利提示。
11. 胜利后需要调用 `decrementGamesLeft()`。

实现注意：

- 计时器应在组件 unmount 时清理，避免离开页面后继续触发状态更新。
- 按钮禁用状态应由游戏阶段控制。
- 用户输入时只需要比较当前点击位置，不必等全部输入完才判断错误。

### 5. Game 3 - Space Invaders

路由：`/space`

该游戏窗口为固定尺寸，原始需求不要求移动端响应。

布局：

- 游戏窗口尺寸为 `500px x 500px`。
- 边框为 `1px solid black`。
- 游戏开始时立即展示：
  - shooter：左下角 `10px x 10px` 红色方块。
  - targets：顶部两排黑色方块。

targets 规则：

- 每个目标方块尺寸为 `20px x 20px`。
- 每个目标方块间距为 `15px`。
- 每排 10 个。
- 共 2 排。

操作：

- 按左方向键，shooter 向左移动 `1px`。
- 按右方向键，shooter 向右移动 `1px`。
- shooter 不允许移出游戏窗口。
- 按空格键射击。
- 如果 shooter 的垂直射击线与某个黑色方块的横向范围重叠，该黑色方块消失。

胜利：

- 所有黑色方块消失后，弹出胜利提示。
- 胜利后需要调用 `decrementGamesLeft()`。
- 游戏随后重置。

实现注意：

- 键盘事件建议绑定在 `window`，并在组件 unmount 时清理。
- shooter 和 targets 可以用绝对定位的 `div` 实现，不需要 canvas 或游戏引擎。
- 判断命中时只需要比较 shooter 的横向范围是否与 target 的横向范围重叠。

## 响应式测试目标

评分会关注以下 viewport：

- 桌面：`1800px x 800px`
- 平板：`1200px x 500px`
- 移动端：`600px x 500px`

重点检查：

- sidebar 宽度和链接文本是否按断点变化。
- footer 宽度是否始终等于 viewport 宽度减去 sidebar 宽度。
- main body 是否没有被 sidebar 或 footer 遮挡。
- Dashboard 文本是否居中。
- Operations 主方框是否在 main body 中垂直居中。
- Memory 上下半区是否正确占据 main body。
- Space 游戏窗口是否保持固定 `500px x 500px`。

## 实现优先级

建议按以下顺序开发：

1. 初始化 Vite + React + Tailwind CSS。
2. 配置 React Router 和四个页面。
3. 实现 `AppLayout`、`Sidebar`、`Footer` 和响应式布局变量。
4. 实现 `ScoreProvider`、远程 score 获取和 localStorage 持久化。
5. 实现 Dashboard，并验证 reset 和 congratulations 逻辑。
6. 实现 Operations。
7. 实现 Memory，并确保计时器清理。
8. 实现 Space，并确保键盘事件清理。
9. 在三个指定 viewport 下手动验证布局和交互。

## 不建议引入的内容

本项目规模较小，不建议引入以下方案：

- Redux、MobX、Zustand 等全局状态库。
- React Query / SWR。
- Phaser、PixiJS 等游戏引擎。
- 后端服务或数据库。
- 复杂组件库。

这些工具会增加实现和调试成本，对当前需求收益不高。
