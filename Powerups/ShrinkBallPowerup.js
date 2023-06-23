class ShrinkBallPowerup extends ChangeBallSizePowerup {
  /**
   * Create a new shrink ball powerup
   * @param {Ball} ball - The ball
   * @param {Paddle} leftPaddle - The left paddle
   * @param {Paddle} rightPaddle - The right paddle
   */
  constructor(ball, leftPaddle, rightPaddle) {
    super(ball, leftPaddle, rightPaddle);

    this.icon = icons.shrink;

    this.sizeMultiplier = 0.5;
  }
}