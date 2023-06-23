class SlowPaddlePowerup extends Powerup {
  /**
   * Create a new slow paddle powerup
   * @param {Ball} ball - The ball
   * @param {Paddle} leftPaddle - The left paddle
   * @param {Paddle} rightPaddle - The right paddle
   */
  constructor(ball, leftPaddle, rightPaddle) {
    super(ball, leftPaddle, rightPaddle);

    this.ownerRequired = true;
    this.actOn = OPPONENT;

    this.icon = icons.slow;

    this.duration = 480;

    this.subject;

    this.orgLimit = 0;
    this.limit = 0;
    this.speedMultiplier = 0.7;
  }

  /**
   * Enable the powerup
   */
  enableAction() {
    this.getSubject();

    this.orgLimit = this.subject.limit;
    this.limit = this.orgLimit * this.speedMultiplier;

    this.subject.limit = this.limit;
  }

  /**
   * Disable the powerup
   */
  disableAction() {
    this.subject.limit = this.orgLimit;
  }
}