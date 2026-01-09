## 大模型

编码能力排行:
https://livecodebench.github.io/leaderboard.html
https://web.lmarena.ai/leaderboard
https://openrouter.ai/rankings

大模型聚合平台:
https://askmany.cn/
https://openrouter.ai/
https://302.ai/

基础依赖的大模型
* claude
* gpt
* qwen
* gemini
* grok
* glm

## 现成Vibe Coding工具

| 工具名称     | 开发方式                   | 是否支持运行 | 是否支持部署 | 使用方式             | 是否开源 |
| ------------ | -------------------------- | ------------ | ------------ | -------------------- | -------- |
| Cursor/Cline | 低复杂度自动编码; 代码补全 | 是           | 否           | 本地IDE, 基于代码    | ❌/✅      |
| Replit       | 中复杂度自动编码; 代码补全 | 是           | 是           | WebIDE, 基于代码     | 部分     |
| Lovable/Bolt | 中复杂度自动编码           | 是           | 是           | Web对话框, 出示结果  | ❌/❌      |
| Devin        | 高复杂度自动编码           | 是           | 是           | 本地对话框, 展示过程 | ❌        |

> Prompt集合, 重点选取几个工具, 研究Prompt怎么写的:
> https://github.com/sien75/system-prompts-and-models-of-ai-tools

> 命令行版代码Agent
> * Codex CLI
> * Claude Code

## 现成多智能体工具

| 工具名称               | 抽象层级 | 适用范围                  | 角色自定义能力               | 是否开源 |
| ---------------------- | -------- | ------------------------- | ---------------------------- | -------- |
| Manus/OpenManus        | 中       | 通用, 通用复杂任务        | 中, 可自定义角色             | ❌/✅      |
| MetaGPT                | 高       | 垂直, 软件开发            | 弱, 但角色可见               | ✅        |
| Lovable                | 高       | 垂直, 全栈Web开发         | 弱, 用户对角色无感           | ❌        |
| Langchain/Flowise/Dify | 低       | 通用, 任何可编排的LLM流程 | 强, 完全自定义行为与通讯协议 | ✅        |

## 现成其他AI工具参考

https://www.bilibili.com/video/BV1pFczegEnm

有价值的工具:
* 产品使用参考
* 可用于依赖的开源项目
