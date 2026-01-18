import React, { useState } from 'react';
import { fileStructure } from './fileStructure';
import './RecipeList.css';

const RecipeList = ({ onRecipeSelect, currentPath }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  // Extract recipe files from file structure
  const getRecipes = () => {
    const recipes = fileStructure.recipes || {};
    return Object.entries(recipes)
      .filter(([name]) => name.endsWith('.md'))
      .map(([name, path]) => ({
        name: name.replace('.md', '').split('-').map(word =>
          word.charAt(0).toUpperCase() + word.slice(1)
        ).join(' '),
        path
      }));
  };

  const recipes = getRecipes();

  const handleRecipeClick = (path) => {
    onRecipeSelect(path);
    setIsExpanded(false); // Auto-collapse on mobile
  };

  const toggleExpanded = () => {
    setIsExpanded(!isExpanded);
  };

  return (
    <nav className="recipe-list">
      <button
        className="recipe-list-toggle"
        onClick={toggleExpanded}
        aria-expanded={isExpanded}
        aria-controls="recipe-menu"
      >
        <span className="recipe-list-title">Recipes</span>
        <span className={`recipe-list-arrow ${isExpanded ? 'expanded' : ''}`}>
          ▾
        </span>
      </button>
      <ul
        id="recipe-menu"
        className={`recipe-menu ${isExpanded ? 'expanded' : ''}`}
      >
        {recipes.map(({ name, path }) => (
          <li key={path}>
            <button
              className={`recipe-item ${currentPath === path ? 'active' : ''}`}
              onClick={() => handleRecipeClick(path)}
            >
              {name}
            </button>
          </li>
        ))}
      </ul>
    </nav>
  );
};

export default RecipeList;
