class ChangeBallSizePowerup extends Powerup {
  /**
   * Create a new change ball size powerup
   * @param {Ball} ball - The ball
   * @param {Paddle} leftPaddle - The left paddle
   * @param {Paddle} rightPaddle - The right paddle
   */
  constructor(ball, leftPaddle, rightPaddle) {
    super(ball, leftPaddle, rightPaddle);

    this.icon = icons.powerup;

    this.transitionDuration = 60;
    this.duration = 720;

    this.orgRadius = 0;
    this.sizeMultiplier = floor(random(0.5, 2));

    this.radiusChange = 0;
  }

  /**
   * Act on the ball
   */
  act() {
    if(this.t <= this.transitionDuration) {
      this.ball.radius += this.radiusChange;
    } else if(this.t > this.duration - this.transitionDuration) {
      this.ball.radius -= this.radiusChange;
    }
  }

  /**
   * Enable the powerup
   */
  enableAction() {
    this.orgRadius = this.ball.radius;

    this.radiusChange = this.orgRadius * (this.sizeMultiplier - 1) / this.transitionDuration;
  }

  /**
   * Disable the powerup
   */
  disableAction() {
    this.ball.radius = this.orgRadius;
  }
}