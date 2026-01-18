# Restoration Instructions

This document provides detailed instructions for restoring the original Terminal/Artemis-based site architecture.

## Quick Restore via Git

The easiest way to restore is using the git tag created before the rework:

```bash
# Option 1: Checkout the tag directly (detached HEAD)
git checkout pre-recipe-rework

# Option 2: Create a new branch from the tag
git checkout -b restore-terminal pre-recipe-rework

# Option 3: Revert all commits since the rework
git revert --no-commit HEAD~N..HEAD  # Replace N with number of commits since rework
git commit -m "Revert recipe site rework"
```

## Manual File Restoration

If you need to manually restore files:

### 1. Restore Source Files

Move the archived source files back to `src/`:

```bash
mv archived/src/Terminal.jsx src/
mv archived/src/Sidebar.jsx src/
mv archived/src/Sidebar.css src/
mv archived/src/config.js src/
```

### 2. Restore Resources

Move the archived resources back:

```bash
mv archived/resources/ds-study-guide resources/
mv archived/resources/writing resources/
mv archived/resources/resume.pdf resources/
```

### 3. Restore Original Components

The following files need to be restored to their original versions (use git checkout or copy from the tag):

**`src/App.jsx`** - Original version imports Terminal, Sidebar, and uses conditional rendering:
```jsx
import React, { useState } from 'react';
import Terminal from './Terminal';
import MarkdownViewer from './MarkdownViewer';
import Sidebar from './Sidebar';
import './App.css';

const App = () => {
  const [selectedFile, setSelectedFile] = useState(null);

  return (
    <div className="app-container">
      <div className="app-main">
        {selectedFile ? (
          <MarkdownViewer filePath={selectedFile} />
        ) : (
          <Terminal />
        )}
      </div>
      <Sidebar
        onFileSelect={setSelectedFile}
        currentPath={selectedFile}
      />
    </div>
  );
};

export default App;
```

**`src/App.css`** - Original version:
```css
.app-container {
  display: flex;
  height: 100vh;
  width: 100%;
  background-color: #3F3F3F;
  overflow: hidden;
}

.app-main {
  flex: 1;
  display: flex;
  flex-direction: column;
  overflow: hidden;
}
```

**`src/index.html`** - Change title back:
```html
<title>Artemis Terminal</title>
```

**`package.json`** - Change name back:
```json
{
  "name": "artemis-chat",
  "description": "Terminal-style chatbot interface for Artemis API"
}
```

**`webpack.config.js`** - Restore DefinePlugin for API key:
```javascript
new webpack.DefinePlugin({
  'process.env.REACT_APP_ARTEMIS_API_KEY': JSON.stringify(process.env.REACT_APP_ARTEMIS_API_KEY),
  'process.env.REACT_APP_ARTEMIS_USE_LOCAL_ENDPOINT': JSON.stringify(process.env.REACT_APP_ARTEMIS_USE_LOCAL_ENDPOINT)
})
```

And restore CopyWebpackPlugin to copy all resources:
```javascript
new CopyWebpackPlugin({
  patterns: [
    { from: 'resources', to: 'resources' }
  ]
})
```

### 4. Remove New Files

Delete the new components created for the recipe site:

```bash
rm src/Header.jsx src/Header.css
rm src/RecipeList.jsx src/RecipeList.css
```

### 5. Regenerate File Structure

After restoring resources, regenerate the file structure:

```bash
npm run generate-files
```

## Environment Variables

The Terminal component requires the following environment variable:

- `REACT_APP_ARTEMIS_API_KEY` - API key for the Artemis backend

This is stored as a GitHub repository secret and automatically injected during CI/CD builds.

For local development with the remote API:
```bash
REACT_APP_ARTEMIS_API_KEY=your-api-key npm start
```

For local development with local API:
```bash
npm run start:local
```

## Dependencies

No dependencies were added or removed during the rework. The same `package.json` dependencies apply.

## Verification Steps

After restoration:

1. Install dependencies: `npm install`
2. Start dev server: `npm start`
3. Verify Terminal loads with ASCII art splash screen
4. Verify sidebar shows all resources (ds-study-guide, writing, recipes, resume.pdf)
5. Test API connection by sending a query
6. Build for production: `npm run build`
7. Test built files: `npx serve docs`

## API Endpoints

The Terminal connects to the Artemis API:

- **Production**: `https://artemis-production-9690.up.railway.app/api/chat`
- **Local**: `http://localhost:8000/api/chat`

The endpoint is automatically selected based on environment (local dev vs production).
