import React, { useState } from 'react';
import Header from './Header';
import RecipeList from './RecipeList';
import MarkdownViewer from './MarkdownViewer';
import './App.css';

const App = () => {
  const [selectedRecipe, setSelectedRecipe] = useState(null);

  return (
    <div className="app">
      <Header />
      <div className="app-content">
        <RecipeList
          onRecipeSelect={setSelectedRecipe}
          currentPath={selectedRecipe}
        />
        <main className="app-main">
          <MarkdownViewer filePath={selectedRecipe} />
        </main>
      </div>
    </div>
  );
};

export default App;
