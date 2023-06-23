class EnlargePaddlePowerup extends ChangePaddleSizePowerup {
  /**
   * Create a new enlarge paddle powerup
   * @param {Ball} ball - The ball
   * @param {Paddle} leftPaddle - The left paddle
   * @param {Paddle} rightPaddle - The right paddle
   */
  constructor(ball, leftPaddle, rightPaddle) {
    super(ball, leftPaddle, rightPaddle);

    this.icon = icons.stretch;

    this.sizeMultiplier = 1.5;
  }
}