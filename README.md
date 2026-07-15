# MoviePilot TMDB 识别增强

这是一个 MoviePilot V2 插件仓库。插件仅在 MoviePilot 原生识别失败后介入，通过有限的 TMDB 搜索词、查询来源置信度和候选评分选择可信结果，再交回原生整理链。

主要能力：

- 优先复用 MoviePilot 识别词和 Rust 已提取的标题、年份、类型、季集信息
- 支持完整标题、主体名称和逐词缩短等可配置搜索策略
- 支持“TMDB 首轮优先”预设，让首次 `/search/multi` 的唯一结果和排名成为主要依据
- 综合标题相似度、token 覆盖、年份、类型、季存在性、查询来源和排名评分
- 可选 DDGS 搜索引擎兜底，外部结果只作为交叉验证证据
- 提供候选试跑、评分解释、运行记录和 Vue 联邦管理页

当前版本：`0.2.4`

## 在 MoviePilot 中安装

1. 将本仓库发布为 GitHub 公共仓库。
2. 打开 MoviePilot 插件市场，进入插件仓库设置。
3. 添加仓库地址：`https://github.com/你的用户名/仓库名`
4. 保存并刷新插件市场，安装“TMDB 识别增强”。
5. 打开插件设置，启用插件并保存。

以后更新时，只需提高 `package.v2.json`、后端 `plugin_version` 和前端 `package.json` 的版本号，然后提交并同步到 GitHub。MoviePilot 刷新市场后会显示更新。

## 本地构建前端

```bash
cd plugins.v2/tmdbrecognizeenhancer
npm install
npm run build
```

构建产物位于 `dist/`，必须一并提交，否则 MoviePilot 无法加载插件页面。

## 说明

- 要让 Docker 中的 MoviePilot 无需额外凭据即可拉取，建议使用公共仓库。
- 当前版本不修改 MoviePilot-Rust；“解析扩展”页面仅为后续能力预留。
- 插件详细策略说明见 [插件说明](plugins.v2/tmdbrecognizeenhancer/README.md)。
