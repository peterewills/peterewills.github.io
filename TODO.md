## Current Status

### Completed
- ✅ Removed "-terminal" option from sidebar filetree
- ✅ Added "Return to Terminal" button at top of sidebar
- ✅ Fixed multi-line bullet point parsing (continuation lines now properly concatenate)
- ✅ Fixed link reference parsing (now supports word references like [sqlzoo], not just numeric)
- ✅ Fixed footnote parsing (footnotes were being consumed by link reference regex)
- ✅ Fixed inline code rendering within bold/italic text (now recursively parses styled content)
- ✅ Added support for LaTeX delimiters: \\( \\) for inline and \\[ \\] for display math
- ✅ Added support for standard markdown code blocks with triple backticks (```)

### In Progress
- 🔧 HTML rendering (iframe in blogging-in-org.md)
  - HTML blocks ARE being detected and parsed correctly
  - They're being added to the elements array with type 'html'
  - The render loop sees them but they're not actually rendering
  - Appears to be an issue with the if-else chain in the render function
  - HTML content is properly extracted (e.g., `<iframe width="560"...></iframe>`)
  - Using `dangerouslySetInnerHTML` to render, but content isn't appearing

### Known Issues
- iframe isn't rendering in blogging-in-org.md despite being properly parsed
