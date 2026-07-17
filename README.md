# MoviePilot TMDB 识别增强

这是一个 MoviePilot V2 插件仓库。插件通过有限的 TMDB 搜索词、查询来源置信度和候选评分选择可信结果，并可把动漫片源的季集归一化到用户选择的 TMDB 编集。

主要能力：

- 优先复用 MoviePilot 识别词和 Rust 已提取的标题、年份、类型、季集信息
- 支持完整标题、主体名称和逐词缩短等可配置搜索策略
- 支持“TMDB 首轮优先”预设，让首次 `/search/multi` 的唯一结果和排名成为主要依据
- 综合标题相似度、token 覆盖、年份、类型、季存在性、查询来源和排名评分
- 手动类型或明确季集坐标会形成候选硬约束，防止电视剧被同名电影/OVA 截胡
- 可选 DDGS 搜索引擎兜底，外部结果只作为交叉验证证据
- 提供候选试跑、评分解释、运行记录和 Vue 联邦管理页
- 目标编集可选 TMDB 默认编集或具体剧集组（支持优先查看 Production/Absolute）
- 通过 TMDB Episode ID、其它编集坐标和全局序号归一化 Season/Episode
- 支持 AniList 季度目录、AniBridge 跨库映射、续作别名片段和目标起始集定位
- 季度选择自动加载，支持地区/载体/续作筛选、标题搜索以及单条或批量直接建立规则
- 运行时捕获 MoviePilot 已应用识别词后的 MetaBase，不修改或覆盖 MoviePilot/Rust 源码

当前版本：`0.4.3`

## 在 MoviePilot 中安装

1. 将本仓库发布为 GitHub 公共仓库。
2. 打开 MoviePilot 插件市场，进入插件仓库设置。
3. 添加仓库地址：`https://github.com/你的用户名/仓库名`
4. 保存并刷新插件市场，安装“TMDB 识别增强”。
5. 打开插件设置，启用插件并保存。
6. 如需使用集数归一化，请在 MoviePilot 中开启“识别插件优先”，再在插件的“集数归一化”页启用并维护目标编集。

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
- 当前版本不修改 MoviePilot、MoviePilot-Rust，也不需要 Docker 覆盖文件或启动补丁。
- 运行时适配器会在插件启动时检查 MoviePilot 识别入口；上游接口不兼容时只停用归一化并显示原因，不影响原生整理。
- 插件详细策略说明见 [插件说明](plugins.v2/tmdbrecognizeenhancer/README.md)。
