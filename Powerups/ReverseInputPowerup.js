class ReverseInputPowerup extends Powerup {
  /**
   * Create a new reverse input powerup
   * @param {Ball} ball - The ball
   * @param {Paddle} leftPaddle - The left paddle
   * @param {Paddle} rightPaddle - The right paddle
   */
  constructor(ball, leftPaddle, rightPaddle) {
    super(ball, leftPaddle, rightPaddle);

    this.ownerRequired = true;
    this.actOn = OPPONENT;

    this.icon = icons.reverse;

    this.duration = 600;
  }

  /**
   * Enable the powerup
   */
  enableAction() {
    this.getSubject();

    this.subject.limit *= -1;
  }

  /**
   * Disable the powerup
   */
  disableAction() {
    this.subject.limit *= -1;
  }
}