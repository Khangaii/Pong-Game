class Powerup {
  /**
   * Create a new powerup
   * @param {Ball} ball - The ball
   * @param {Paddle} leftPaddle - The left paddle
   * @param {Paddle} rightPaddle - The right paddle
   */
  constructor(ball, leftPaddle, rightPaddle) {
    this.radius = 30;
    this.radius = displayWidth/50;

    this.timerPosition = createVector(windowWidth / 2, windowHeight / 12);
    this.position = this.timerPosition.copy();

    this.color = ball.colors[0];

    this.ball = ball;

    this.leftPaddle = leftPaddle;

    this.rightPaddle = rightPaddle;

    this.isActive = false;

    this.duration = 300;
    this.t = 0;
    this.remainingTime = floor((this.duration - this.t) / FRAME_RATE);

    this.icon = icons.powerup;

    this.ownerRequired = false;

    this.actOn = SELF;

    this.owner = 0;
    this.opponent = 0;
    this.subject;
  }

  /**
   * Get the subject of the powerup
   * @returns {Number} The state of the subject; 0: no subject, 1: subject found
   */
  getSubject() {
    let paddle;

    if(this.actOn == SELF) {
      paddle = this.owner;
    }else if(this.actOn == OPPONENT) {
      paddle = this.opponent;
    }
    
    switch(paddle) {
      case 1:
        this.subject = leftPaddle;
        break;
      case 2:
        this.subject = rightPaddle;
        break;
      default:
        return 0;
    }

    return 1;
  }

  /**
   * Act on the subject
   */
  act() {

  }

  /**
   * Update the powerup
   * @returns {Number} The state of the powerup; 0: powerup disabled, 1: powerup active
   */
  update() {
    if(this.isActive) {
      this.act();

      this.t++;
      this.remainingTime = floor((this.duration - this.t) / FRAME_RATE);

      if(this.t > this.duration) {
        this.disable();

        return 0;
      }
    }

    return 1;
  }

  /**
   * Display the effects of the powerup
   */
  displayEffects() {

  }

  /**
   * Display the powerup
   */
  display() {
    if(this.isActive) {
      this.displayEffects();
    }

    push();

    noStroke();
    stroke(255);
    strokeWeight(2);
    fill(this.color);

    ellipseMode(RADIUS);
    ellipse(this.position.x, this.position.y, this.radius);

    imageMode(CENTER);
    image(this.icon, this.position.x, this.position.y, this.radius*2, this.radius*2);

    pop();
  }

  /**
   * The action to perform when the powerup is enabled
   */
  enableAction() {

  }

  /**
   * Enable the powerup
   */
  enable() {
    this.owner = this.ball.owner;
    this.opponent = 3 - this.owner;

    if(this.ownerRequired) {
      this.color = this.ball.color;
    }

    if(!this.ownerRequired || (this.ownerRequired && this.owner > 0)) {
      powerupSound.play();
      
      this.enableAction();

      this.isActive = true;

      this.moveTo(this.timerPosition.x, this.timerPosition.y);
    }
  }

  /**
   * The action to perform when the powerup is disabled
   */
  disableAction() {

  }

  /**
   * Disable the powerup
   */
  disable() {
    if(this.isActive) {
      powerdownSound.play();

      this.color = this.ball.colors[0];

      this.disableAction();

      this.isActive = false;

      this.t = 0;
    }
  }

  /**
   * Move the powerup to a position
   * @param {Number} x - The x coordinate
   * @param {Number} y - The y coordinate
   */
  moveTo(x, y) {
    this.position.set(x, y);
  }
}