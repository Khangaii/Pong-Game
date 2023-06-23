class EnlargeBallPowerup extends ChangeBallSizePowerup {
  /**
   * Create a new enlarge ball powerup
   * @param {Ball} ball - The ball
   * @param {Paddle} leftPaddle - The left paddle
   * @param {Paddle} rightPaddle - The right paddle
   */
  constructor(ball, leftPaddle, rightPaddle) {
    super(ball, leftPaddle, rightPaddle);

    this.icon = icons.expand;

    this.sizeMultiplier = 2;
  }
}