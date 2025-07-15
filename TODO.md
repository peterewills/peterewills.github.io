- I'm getting an error "API Error: 400 messages.10: `tool_use` ids were found without
  `tool_result` blocks immediately after: toolu_bdrk_01MTNtEytW31t3zKq9xyaAyw. Each
  `tool_use` block must have a corresponding `tool_result` block in the next message."
  This is because I removed the tool_result block. Can you remove the code that expects
  a tool_result?

- Add example queries to prompt in react app
- Add basic markdown rendering
