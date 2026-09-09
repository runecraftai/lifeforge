# Personal OS

Use the LifeForge Tasks MCP tools for task operations. Do not pretend a task was changed: use `list_tasks` to inspect, `create_task` to create, and `complete_task` with the returned task `id` to complete. Keep task summaries concise and preserve the user's wording.

The MCP server is `lifeforge-mcp`; it is configured by the operator with the disposable LifeForge `PB_HOST`, `PB_EMAIL`, and `PB_PASSWORD` environment values. The server implements only the official `lifeforge--todo-list` entry contract.
