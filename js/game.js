import { Ball } from './ball.js';
import { Paddle } from './paddle.js';
import { InputHandler } from './input.js';

export class Game {
  constructor() {
    this.canvas = document.getElementById('pongCanvas');
    this.ctx = this.canvas.getContext('2d');
    this.playerScoreElement = document.getElementById('playerScore');
    this.aiScoreElement = document.getElementById('aiScore');
    this.startButton = document.getElementById('startButton');
    
    this.width = 700;
    this.height = 400;
    this.canvas.width = this.width;
    this.canvas.height = this.height;
    
    this.playerScore = 0;
    this.aiScore = 0;
    
    this.gameState = 'menu'; // menu, playing, gameOver
    
    // Game objects
    this.ball = new Ball(this);
    this.playerPaddle = new Paddle(this, true);
    this.aiPaddle = new Paddle(this, false);
    
    // Input handling
    this.input = new InputHandler(this);
    
    // Animation frame ID for cancellation
    this.animationId = null;
  }
  
  initialize() {
    // Set up event listeners
    this.startButton.addEventListener('click', () => {
      this.startGame();
    });
    
    // Draw the initial state
    this.draw();
  }
  
  startGame() {
    this.gameState = 'playing';
    this.playerScore = 0;
    this.aiScore = 0;
    this.updateScore();
    this.ball.reset();
    this.playerPaddle.reset();
    this.aiPaddle.reset();
    
    // Start the game loop
    if (this.animationId) {
      cancelAnimationFrame(this.animationId);
    }
    this.gameLoop();
  }
  
  gameLoop(timestamp) {
    // Update game objects
    this.update();
    
    // Draw everything
    this.draw();
    
    // Continue the loop
    if (this.gameState === 'playing') {
      this.animationId = requestAnimationFrame((timestamp) => this.gameLoop(timestamp));
    }
  }
  
  update() {
    this.ball.update();
    this.playerPaddle.update();
    this.aiPaddle.update(this.ball);
    
    // Check for scoring
    if (this.ball.x < 0) {
      // AI scores
      this.aiScore++;
      this.updateScore();
      this.ball.reset();
      
      if (this.aiScore >= 5) {
        this.gameOver();
      }
    }
    
    if (this.ball.x > this.width) {
      // Player scores
      this.playerScore++;
      this.updateScore();
      this.ball.reset();
      
      if (this.playerScore >= 5) {
        this.gameOver();
      }
    }
  }
  
  draw() {
    // Clear the canvas
    this.ctx.fillStyle = '#000';
    this.ctx.fillRect(0, 0, this.width, this.height);
    
    // Draw the center line
    this.ctx.setLineDash([5, 15]);
    this.ctx.beginPath();
    this.ctx.moveTo(this.width / 2, 0);
    this.ctx.lineTo(this.width / 2, this.height);
    this.ctx.strokeStyle = '#fff';
    this.ctx.stroke();
    this.ctx.setLineDash([]);
    
    // Draw game objects
    this.ball.draw(this.ctx);
    this.playerPaddle.draw(this.ctx);
    this.aiPaddle.draw(this.ctx);
    
    // Draw game state messages
    if (this.gameState === 'menu') {
      this.drawCenteredText('PONG', 50);
      this.drawCenteredText('Click START to play', 24, 50);
    } else if (this.gameState === 'gameOver') {
      const winner = this.playerScore > this.aiScore ? 'YOU WIN!' : 'AI WINS!';
      this.drawCenteredText(winner, 50);
      this.drawCenteredText('Click START to play again', 24, 50);
    }
  }
  
  drawCenteredText(text, fontSize, yOffset = 0) {
    this.ctx.fillStyle = '#fff';
    this.ctx.font = `${fontSize}px Arial`;
    const textWidth = this.ctx.measureText(text).width;
    this.ctx.fillText(text, (this.width - textWidth) / 2, this.height / 2 + yOffset);
  }
  
  updateScore() {
    this.playerScoreElement.textContent = this.playerScore;
    this.aiScoreElement.textContent = this.aiScore;
  }
  
  gameOver() {
    this.gameState = 'gameOver';
  }
}
