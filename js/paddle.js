export class Paddle {
  constructor(game, isPlayer) {
    this.game = game;
    this.isPlayer = isPlayer;
    this.width = 10;
    this.height = 80;
    this.speed = 6;
    this.reset();
  }
  
  reset() {
    this.y = (this.game.height - this.height) / 2;
    
    if (this.isPlayer) {
      this.x = 20; // Left side
    } else {
      this.x = this.game.width - 20 - this.width; // Right side
    }
    
    this.moveUp = false;
    this.moveDown = false;
  }
  
  update(ball) {
    if (this.game.gameState !== 'playing') return;
    
    if (this.isPlayer) {
      // Player controlled paddle
      if (this.moveUp) {
        this.y = Math.max(0, this.y - this.speed);
      }
      if (this.moveDown) {
        this.y = Math.min(this.game.height - this.height, this.y + this.speed);
      }
    } else {
      // AI controlled paddle
      this.aiMovement(ball);
    }
  }
  
  aiMovement(ball) {
    // Simple AI: follow the ball with a slight delay
    const paddleCenter = this.y + this.height / 2;
    const ballCenter = ball.y;
    
    // Add some difficulty by limiting the AI's reaction time
    if (ball.velocityX > 0) { // Only move when ball is coming towards AI
      // Add some randomness to make the AI imperfect
      const reactionDelay = Math.random() * 0.3;
      
      if (paddleCenter < ballCenter - 10) {
        this.y += this.speed * (0.7 + reactionDelay);
      } else if (paddleCenter > ballCenter + 10) {
        this.y -= this.speed * (0.7 + reactionDelay);
      }
      
      // Keep the paddle within bounds
      this.y = Math.max(0, Math.min(this.game.height - this.height, this.y));
    }
  }
  
  draw(ctx) {
    ctx.fillStyle = '#fff';
    ctx.fillRect(this.x, this.y, this.width, this.height);
  }
}
