/// <reference types="vite/client" />

// animal-island-ui 的样式子路径导出（package.json exports 中声明），
// 作为 side-effect import 使用时 TS 需要显式模块声明。
declare module 'animal-island-ui/style'
