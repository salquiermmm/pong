export class Ball {
  constructor(game) {
    this.game = game;
    this.size = 10;
    this.reset();
  }
  
  reset() {
    // Position the ball in the center
    this.x = this.game.width / 2;
    this.y = this.game.height / 2;
    
    // Random initial direction
    const angle = Math.random() * Math.PI / 4 - Math.PI / 8;
    const direction = Math.random() < 0.5 ? 1 : -1;
    
    this.speed = 5;
    this.velocityX = direction * Math.cos(angle) * this.speed;
    this.velocityY = Math.sin(angle) * this.speed;
  }
  
  update() {
    if (this.game.gameState !== 'playing') return;
    
    // Move the ball
    this.x += this.velocityX;
    this.y += this.velocityY;
    
    // Wall collision (top and bottom)
    if (this.y < this.size || this.y > this.game.height - this.size) {
      this.velocityY = -this.velocityY;
      // Keep the ball within bounds
      this.y = this.y < this.size ? this.size : this.game.height - this.size;
    }
    
    // Paddle collision
    this.checkPaddleCollision();
  }
  
  checkPaddleCollision() {
    // Player paddle collision
    if (
      this.x - this.size <= this.game.playerPaddle.x + this.game.playerPaddle.width &&
      this.x - this.size > this.game.playerPaddle.x &&
      this.y >= this.game.playerPaddle.y &&
      this.y <= this.game.playerPaddle.y + this.game.playerPaddle.height
    ) {
      this.handlePaddleCollision(this.game.playerPaddle);
    }
    
    // AI paddle collision
    if (
      this.x + this.size >= this.game.aiPaddle.x &&
      this.x + this.size < this.game.aiPaddle.x + this.game.aiPaddle.width &&
      this.y >= this.game.aiPaddle.y &&
      this.y <= this.game.aiPaddle.y + this.game.aiPaddle.height
    ) {
      this.handlePaddleCollision(this.game.aiPaddle);
    }
  }
  
  handlePaddleCollision(paddle) {
    // Reverse x direction
    this.velocityX = -this.velocityX;
    
    // Increase speed slightly with each hit
    this.speed += 0.2;
    
    // Calculate new angle based on where the ball hit the paddle
    const paddleCenter = paddle.y + paddle.height / 2;
    const relativeIntersectY = paddleCenter - this.y;
    const normalizedRelativeIntersectionY = relativeIntersectY / (paddle.height / 2);
    const bounceAngle = normalizedRelativeIntersectionY * (Math.PI / 4); // Max 45 degrees
    
    // Calculate new velocity components
    const direction = this.velocityX > 0 ? -1 : 1;
    const velocity = Math.sqrt(this.velocityX * this.velocityX + this.velocityY * this.velocityY);
    
    this.velocityX = direction * Math.cos(bounceAngle) * this.speed;
    this.velocityY = -Math.sin(bounceAngle) * this.speed;
    
    // Play sound (if we had sound)
  }
  
  draw(ctx) {
    ctx.fillStyle = '#fff';
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
    ctx.fill();
  }
}
