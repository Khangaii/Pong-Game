class GravityPowerup extends Powerup {
  /**
   * Create a new gravity powerup
   * @param {Ball} ball - The ball
   * @param {Paddle} leftPaddle - The left paddle
   * @param {Paddle} rightPaddle - The right paddle
   */
  constructor(ball, leftPaddle, rightPaddle) {
    super(ball, leftPaddle, rightPaddle);

    this.icon = icons.gravity;

    this.duration = 420;

    this.gForce = createVector(0, 7);
  }

  act() {
    ball.applyForce(this.gForce);
  }
}