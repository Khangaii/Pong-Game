class HideSidePowerup extends Powerup {
  /**
   * Create a new hide side powerup
   * @param {Ball} ball - The ball
   * @param {Paddle} leftPaddle - The left paddle
   * @param {Paddle} rightPaddle - The right paddle
   */
  constructor(ball, leftPaddle, rightPaddle) {
    super(ball, leftPaddle, rightPaddle);

    this.ownerRequired = true;

    this.icon = icons.hidden;

    this.duration = 480;

    this.corner = createVector(0, 0);
    this.size = createVector(windowWidth / 2, windowHeight);
  }

  /**
   * Display the effects of the powerup
   */
  displayEffects() {
    push();

    this.ball.color.setAlpha(240);
    fill(this.ball.color);
    this.ball.color.setAlpha(255);
    noStroke();

    rectMode(CORNER);
    rect(this.corner.x, this.corner.y, this.size.x, this.size.y);

    pop();
  }

  /**
   * Enable the powerup
   */
  enableAction() {
    if(this.owner === 2) {
      this.corner.set(0, 0);
    } else {
      this.corner.set(windowWidth / 2, 0);
    }
  }
}