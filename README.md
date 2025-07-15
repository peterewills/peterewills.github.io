# Artemis Terminal Chat

A simple terminal-style React chatbot interface for the Artemis API.

## Development

1. Install dependencies:
```bash
npm install
```

2. Start development server:
```bash
npm start
```

3. Build for production:
```bash
npm run build
```

This will create the production build in the `docs` folder, which GitHub Pages will serve automatically.

## Deployment

The site is served from the `docs/` directory. Before committing changes:

1. Run the build command:
```bash
npm run build
```

2. Commit both your source changes and the updated `docs/` folder

3. Push to GitHub - the site will be automatically deployed from the `docs` folder.
