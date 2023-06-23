class ShrinkPaddlePowerup extends ChangePaddleSizePowerup {
  /**
   * Create a new shrink paddle powerup
   * @param {Ball} ball - The ball
   * @param {Paddle} leftPaddle - The left paddle
   * @param {Paddle} rightPaddle - The right paddle
   */
  constructor(ball, leftPaddle, rightPaddle) {
    super(ball, leftPaddle, rightPaddle);

    this.actOn = OPPONENT;

    this.icon = icons.compress;

    this.sizeMultiplier = 0.7;
  }
}