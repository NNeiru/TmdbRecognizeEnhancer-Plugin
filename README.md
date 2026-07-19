# MoviePilot 媒体整理增强

面向 MoviePilot V2 的媒体识别与整理增强插件。插件通过 MoviePilot 插件接口扩展 TMDB 候选选择、动漫集数偏移、命名规则和 Emby 剧集组联动，不修改 MoviePilot 或 MoviePilot-Rust 源码。

当前正式版本：`0.6.0`

## 功能概览

| 模块 | 作用 |
| --- | --- |
| TMDB 搜索增强 | 复用 MP 已解析的标题、年份、类型和季集信息，提供首结果模式或可解释评分模式 |
| 集数偏移 | 将片源中的累计集数、相对集数等坐标转换为 TMDB 默认编集或指定剧集组坐标 |
| 季度番剧看板 | 汇总季度动画，辅助匹配 TMDB 并批量建立偏移规则 |
| Emby 剧集组联动 | 整理实际采用剧集组后，安全定位 Emby Series 并写入 StrmAssistant 的 `TmdbEg` |
| 字段与制作组 | 查看 MP 内置识别规则、设置插件覆盖层和制作组类型证据 |
| 命名规则 | 自定义 Jinja2 字段、制作组编排、连接与分隔默认值，以及最终路径文本映射 |
| 诊断工具 | 综合试跑完整处理链，统一查看模块日志和按需性能采样 |

## 兼容要求

- MoviePilot V2 `>= 2.13.0`
- 使用集数偏移时，需要在 MoviePilot 中启用“识别插件优先”
- Emby 剧集组联动是可选功能，需要：
  - MoviePilot 已配置可用的 Emby 媒体服务器
  - Emby 已安装支持 TMDB 剧集组的 StrmAssistant
  - MP 整理使用的剧集组规则包含有效 `episode_group_id`

插件会在启动时检测运行时接口。上游版本不兼容时，仅停用对应扩展并在页面显示原因，不会改写容器内程序文件。

## 安装与更新

1. 在 MoviePilot 的“插件仓库”设置中添加：

   ```text
   https://github.com/NNeiru/TmdbRecognizeEnhancer-Plugin
   ```

2. 刷新插件市场，安装“媒体整理增强”。
3. 打开插件页面，在“状态与开关”中启用插件和需要的模块并保存。
4. 发布新版本后刷新插件市场；MoviePilot 会根据 `package.v2.json` 和 GitHub Release 提示更新。

首次配置建议按以下顺序进行：

1. 启用插件总开关。
2. 选择 TMDB 搜索模式并用“综合试跑”验证典型文件名。
3. 如需集数偏移，启用该模块并建立目标编集规则。
4. 如需自动维护 Emby 剧集组，再配置服务器选择、路径映射和冲突策略。
5. 最后配置制作组与命名规则，并再次检查最终命名试算结果。

## 安全边界

- 不修改 MoviePilot、MoviePilot-Rust、Emby 或 StrmAssistant 源码。
- 原有 MoviePilot 识别词先执行，插件只消费处理后的上下文。
- TMDB 候选、集数映射或 Emby Series 无法唯一确定时默认停止，不按标题强行写入。
- Emby 凭据直接复用 MoviePilot 配置，插件不保存第二份 API Key。
- 规则和任务保存在 MoviePilot 插件数据中，更新插件不会主动清除用户配置。

## 开发与发布

前端源码位于 `plugins.v2/tmdbrecognizeenhancer`：

```bash
cd plugins.v2/tmdbrecognizeenhancer
npm install
npm run build
```

测试命令：

```bash
pytest -q tests
```

正式发布需要同时更新以下三处版本号，并提交对应的当前版本前端产物：

- `package.v2.json`
- `plugins.v2/tmdbrecognizeenhancer/__init__.py` 中的 `plugin_version`
- `plugins.v2/tmdbrecognizeenhancer/package.json`

提交到 `main` 后，GitHub Actions 会校验版本、版本历史和前端入口，随后生成 MoviePilot 可安装的 Release ZIP。请勿手工压缩整个仓库作为插件包。

更完整的模块说明、处理顺序和排障方法见 [插件说明](plugins.v2/tmdbrecognizeenhancer/README.md)。
