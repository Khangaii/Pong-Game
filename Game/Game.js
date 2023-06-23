class Game {
  /**
   * Create a game object
   * @param {Paddle} leftPaddle - The left paddle
   * @param {Paddle} rightPaddle - The right paddle
   * @param {Ball} ball - The ball
   * @param {ScoreBoard} scoreBoard - The score board
   * @param {WinScreen} winScreen - The win screen
   * @param {Object} options - The options
   * @param {number} options.winningPoints - The winning points
   * @param {PowerupSystem} options.powerupSystem - The powerup system
   * @param {p5.Color} options.backgroundColor - The background color
   */ 
  constructor(leftPaddle, rightPaddle, ball, scoreBoard, winScreen, options = {}) {
    this.leftPaddle = leftPaddle;
    this.rightPaddle = rightPaddle;

    this.ball = ball;

    this.scoreBoard = scoreBoard;

    this.powerupSystem = getDefined(new PowerupSystem(), options.powerupSystem);

    this.winScreen = winScreen;

    this.winningPoints = getDefined(11, options.winningPoints);

    this.winner = 0;

    this.server = 1;

    this.backgroundColor = getDefined(color(175, 203, 255), options.backgroundColor);

    this.divider = new Divider();

    this.paused = false;
  }

  /**
   * Update the game's state
   */
  update() {
    if(!this.paused) {
      this.winScreen.winner = this.winner;
      this.leftPaddle.update();
      this.rightPaddle.update();

      this.powerupSystem.update();

      if(this.ball.update() === 0) { // If the ball is out of bounds
        this.run();
      } else { // If the ball is in bounds
        if(this.powerupSystem.currentPowerup === null || this.powerupSystem.currentPowerup.isActive) { // If there is no powerup or a powerup is active
          this.ball.collideObjects(
            {function: this.ball.collidePaddle, args: [this.leftPaddle]},
            {function: this.ball.collidePaddle, args: [this.rightPaddle]}
          )
        } else { // If there is a powerup and it is not active
          this.ball.collideObjects(
            {function: this.ball.collidePaddle, args: [this.leftPaddle]},
            {function: this.ball.collidePaddle, args: [this.rightPaddle]},
            {function: this.ball.collidePowerup, args: [this.powerupSystem.currentPowerup]}
          )
        }

        this.run();
      }

      // If a player has won
      if(this.winner > 0) {
        this.winScreen.update();
      }
    }
  }

  /**
   * Display the game
   */
  display() {
    background(this.backgroundColor);

    this.divider.display();

    this.powerupSystem.display();

    this.scoreBoard.display();

    this.ball.display();

    this.leftPaddle.display();
    this.rightPaddle.display();

    if(this.paused) {
      this.displayPause();
    }

    // If a player has won
    if(this.winner > 0) {
      this.winScreen.display();
    }
  }

  /**
   * Display the pause symbol
   */
  displayPause() {
    noStroke();
    fill(255);

    rectMode(CENTER);

    rect(width * 24 / 50, height / 2, width * 1.5 / 100, height  * 12 / 100, 20);
    rect(width * 26 / 50, height / 2, width * 1.5 / 100, height  * 12 / 100, 20);
  }

  /**
   * Track the score
   * @returns {number} The player who scored
   */
  trackScore() {
    let xPos = this.ball.position.x;
    let radius = this.ball.radius;
    let scorer = 0;
    if(xPos - radius <= 0) {
      this.scoreBoard.scores[1].increase();
      scorer = 2;
    } else if(xPos + radius >= width) {
      this.scoreBoard.scores[0].increase();
      scorer = 1;
    }

    return scorer;
  }

  /**
   * Start another round
   */
  run() {
    let scorer = this.trackScore();

    if(scorer > 0) {
      scorePointSound.play();

      this.server = 3 - scorer;
      this.restart();

      if(this.scoreBoard.scores[scorer-1].score >= this.winningPoints && this.winner <= 0) {
        let rand = random();

        if(rand < 0.05) {
          rand = 0;
        } else {
          rand = floor(random(1, VICTORY_MUSIC_NUM));
        }

        let musicName = victoryMusicNames[rand];
        victoryMusic[musicName].play();

        this.display();
        this.winner = scorer;
        this.winScreen.winner = scorer;
        this.winScreen.points[0] = this.scoreBoard.scores[0].score;
        this.winScreen.points[1] = this.scoreBoard.scores[1].score;
      }
    }
  }

  /**
   * Restart the round
   */
  restart() {
    let side = this.server;

    this.ball.position.set(width/2, height/2);
    let angle; 
    let dif=radians(floor(random(-30, 30)));

    if(side === 1) {
      angle = radians(180);
    }
    else {
      angle = 0;
    }

    angle += dif;

    this.ball.velocity.setHeading(angle);
    this.ball.velocity.setMag(this.ball.initialMag);

    this.ball.setOwner(0);
  }

  /**
   * Reset the game
   */
  reset() {
    this.restart();
    this.ball.velocity.set(-this.ball.initialMag, 0);

    for(let score of this.scoreBoard.scores) {
      score.set(0);
    }

    for(let paddle of [leftPaddle, rightPaddle]) {
      paddle.reset();
    }

    this.powerupSystem.reset();

    this.winner = 0;

    for(let i = 0; i < VICTORY_MUSIC_NUM; i++) {
      let musicName = victoryMusicNames[i];
      victoryMusic[musicName].stop();
    }

    this.winScreen.reset();
  }
}

/**
 * A class to represent a divider
 */
class Divider{
  /**
   * Create a divider
   * @param {number} x - The x position of the divider
   * @param {number} w - The width of the divider
   * @param {color} clr - The color of the divider
   */
  constructor(x = width/2, w = 2, clr = color(255)) {
    this.x = x;

    this.color = clr;

    this.width = w;
  }

  /**
   * Display the divider
   */
  display() {
    stroke(this.color);
    strokeWeight(this.width);

    line(this.x, 0, this.x, height);
  }
}