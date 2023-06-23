class Paddle {
  constructor(number, buttons, x, y, options = {}) {
    /**
     * Paddle constructor
     * @param {number} number - The paddle identifier
     * @param {Object} buttons - The buttons used to control the paddle
     * @param {number} buttons.up - The up button
     * @param {number} buttons.down - The down button
     * @param {number} buttons.shift - The shift button
     * @param {number} x - The x position of the paddle
     * @param {number} y - The y position of the paddle
     * @param {Object} options - The options for the paddle
     */

    this.number = number;
    
    this.initialPos = createVector(x, y);
    this.position = this.initialPos.copy();
    this.velocity = createVector(0, 0);
    this.acceleration = createVector(0, 0);

    this.width = getDefined(20, options.width);
    this.height = getDefined(150, options.height);

    this.upButton = buttons.up;
    this.downButton = buttons.down;
    this.shiftButton = buttons.shift;

    // The shift speed multiplier
    this.shiftMult = getDefined(2, options.shiftMult);

    // Paddle color
    this.color = getDefined(color(75, 115, 225), options.color);

    // Stroke weight
    this.strokeWeight = getDefined(0, options.stokeWeight);

    // The maximum speed of the paddle
    this.limit = getDefined(7*this.shiftMult, options.limit);

    this.mass = getDefined(w * h / 100, options.mass);

    // The friction of the paddle
    this.friction = getDefined(0.5, options.friction);

    // The force transfer of the paddle
    this.forceTransfer = getDefined(0.8, options.forceTransfer);

    // The serial input
    this.serialInput = "00";
  }

  applyForce(force) {
    /**
     * Applies a force to the paddle
     */

    let f = force.copy();

    f.div(this.mass);

    this.acceleration.add(f);
  }

  display() {
    /**
     * Displays the paddle
     */

    push();

    stroke(0, 0, 0);
    strokeWeight(this.strokeWeight);

    fill(this.color);

    rectMode(CENTER);
    rect(this.position.x, this.position.y, this.width, this.height);

    pop();
  }

  update() {
    /**
     * Updates the paddle
     */

    this.move();

    this.velocity.add(this.acceleration);
    this.velocity.limit(this.limit);
    this.position.add(this.velocity);

    // Check for boundary collisions
    this.checkEdges();

    this.acceleration.mult(0);
  }

  checkEdges() {
    /**
     * Checks for boundary collisions
     */

    let left = this.position.x - this.width / 2,
        right = this.position.x + this.width / 2,
        top = this.position.y - this.height / 2,
        bottom = this.position.y + this.height /2;

    if(left < 0) {
      this.position.x = this.width / 2;
      this.velocity.x = 0;
    } else if(right > width) {
      this.position.x = width - this.width / 2;
      this.velocity.x = 0;
    }

    if(top < 0) {
      this.position.y = this.height / 2;
      this.velocity.y = 0;
    } else if(bottom > height) {
      this.position.y = height - this.height / 2;
      this.velocity.y = 0;
    }
  }

  move() {
    /**
     * Moves the paddle
     */

    let velocity = createVector(0, 0);
    let normalSpeed = this.limit / this.shiftMult;

    // if(keyIsDown(this.upButton) && !keyIsDown(this.downButton)) {
    //   velocity.y = -normalSpeed;
    // } else if(keyIsDown(this.downButton) && !keyIsDown(this.upButton)) {
    //   velocity.y = normalSpeed;
    // }

    // if(keyIsDown(this.shiftButton)) {
    //   velocity.mult(this.shiftMult);
    // }

    if(this.serialInput[0] === '1' && this.serialInput[1] === '0') {
      velocity.y = -normalSpeed;
    } else if(this.serialInput[0] === '0' && this.serialInput[1] === '1') {
      velocity.y = normalSpeed;
    }

    velocity.mult(this.shiftMult);

    this.velocity.set(velocity);
  }

  reset() {
    /**
     * Resets the paddle
     */

    this.position = this.initialPos.copy();
    this.acceleration.mult(0);
    this.velocity.mult(0);
  }
}