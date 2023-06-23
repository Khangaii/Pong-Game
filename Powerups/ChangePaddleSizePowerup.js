class ChangePaddleSizePowerup extends Powerup {
  /**
   * Create a new change paddle size powerup
   * @param {Ball} ball - The ball
   * @param {Paddle} leftPaddle - The left paddle
   * @param {Paddle} rightPaddle - The right paddle
   */
  constructor(ball, leftPaddle, rightPaddle) {
    super(ball, leftPaddle, rightPaddle);

    this.ownerRequired = true;

    this.icon = icons.powerup;

    this.transitionDuration = 60;
    this.duration = 600;

    this.orgHeight = 0;
    this.sizeMultiplier = random(0.5, 2);

    this.heightChange = 0;
  }

  /**
   * Act on the paddle
   */
  act() {
    if(this.t <= this.transitionDuration) {
      this.subject.height += this.heightChange;
    } else if(this.t > this.duration - this.transitionDuration) {
      this.subject.height -= this.heightChange;
    }
  }

  /**
   * Enable the powerup
   */
  enableAction() {
    this.getSubject();

    this.orgHeight = this.subject.height;

    this.heightChange = this.orgHeight * (this.sizeMultiplier - 1) / this.transitionDuration;
  }

  /**
   * Disable the powerup
   */
  disableAction() {
    this.subject.height = this.orgHeight;
  }
}