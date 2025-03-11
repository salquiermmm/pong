export class InputHandler {
  constructor(game) {
    this.game = game;
    
    // Keyboard controls
    window.addEventListener('keydown', (e) => {
      if (this.game.gameState !== 'playing') return;
      
      switch (e.key) {
        case 'ArrowUp':
          this.game.playerPaddle.moveUp = true;
          break;
        case 'ArrowDown':
          this.game.playerPaddle.moveDown = true;
          break;
      }
    });
    
    window.addEventListener('keyup', (e) => {
      switch (e.key) {
        case 'ArrowUp':
          this.game.playerPaddle.moveUp = false;
          break;
        case 'ArrowDown':
          this.game.playerPaddle.moveDown = false;
          break;
        case ' ': // Spacebar
          if (this.game.gameState === 'menu' || this.game.gameState === 'gameOver') {
            this.game.startGame();
          }
          break;
      }
    });
    
    // Touch controls for mobile
    this.setupTouchControls();
  }
  
  setupTouchControls() {
    this.game.canvas.addEventListener('touchstart', (e) => {
      e.preventDefault();
      const touch = e.touches[0];
      const canvasRect = this.game.canvas.getBoundingClientRect();
      const touchY = touch.clientY - canvasRect.top;
      
      if (touchY < this.game.height / 2) {
        this.game.playerPaddle.moveUp = true;
        this.game.playerPaddle.moveDown = false;
      } else {
        this.game.playerPaddle.moveUp = false;
        this.game.playerPaddle.moveDown = true;
      }
    });
    
    this.game.canvas.addEventListener('touchmove', (e) => {
      e.preventDefault();
      const touch = e.touches[0];
      const canvasRect = this.game.canvas.getBoundingClientRect();
      const touchY = touch.clientY - canvasRect.top;
      
      if (touchY < this.game.height / 2) {
        this.game.playerPaddle.moveUp = true;
        this.game.playerPaddle.moveDown = false;
      } else {
        this.game.playerPaddle.moveUp = false;
        this.game.playerPaddle.moveDown = true;
      }
    });
    
    this.game.canvas.addEventListener('touchend', (e) => {
      e.preventDefault();
      this.game.playerPaddle.moveUp = false;
      this.game.playerPaddle.moveDown = false;
    });
  }
}
