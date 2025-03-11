import './style.css';
import { Game } from './js/game.js';

// Initialize the game when the DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
  const game = new Game();
  game.initialize();
});
