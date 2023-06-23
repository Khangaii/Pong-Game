class AccelerateBallPowerup extends Powerup {
  /**
   * Create a new accelerate ball powerup
   * @param {Ball} ball - The ball
   * @param {Paddle} leftPaddle - The left paddle
   * @param {Paddle} rightPaddle - The right paddle
   */
  constructor(ball, leftPaddle, rightPaddle) {
    super(ball, leftPaddle, rightPaddle);

    this.icon = icons.accelerate;

    this.duration = 600;

    this.orgLimit = this.ball.limit;
    this.limit = this.ball.limit * 1.5;

    this.orgAccelSpeed = this.ball.accelSpeed;
    this.accelSpeed = this.ball.accelSpeed * 3;
  }

  /**
   * Act on the ball
   */
  act() {
    this.ball.move();
  }

  /**
   * Enable the powerup
   */
  enableAction() {
    this.ball.limit = this.limit;
    this.ball.accelSpeed = this.accelSpeed;
  }

  /**
   * Disable the powerup
   */
  disableAction() {
    this.ball.limit = this.orgLimit;
    this.ball.accelSpeed = this.orgAccelSpeed;
  }
}