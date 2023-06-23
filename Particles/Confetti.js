class Confetti extends Particle {
  /**
   * Create a new confetti
   * @param {number} x - The x position of the confetti
   * @param {number} y - The y position of the confetti
   * @param {Object} options - The options for the confetti
   * @param {number} options.radius - The radius of the confetti
   * @param {p5.Color} options.color - The color of the confetti
   * @param {number} options.fade - The fade rate of the confetti
   * @param {number} options.angle - The angle of the confetti
   * @param {number} options.aVelocity - The angular velocity of the confetti
   * @param {number} options.aAcceleration - The angular acceleration of the confetti
   * @param {number} options.aLimit - The angular velocity limit of the confetti
   */
  constructor(x, y, options = {}) {
    options.radius = getDefined(5, options.radius);
    options.color = getDefined(color(7, 42, 200), options.color);
    options.fade = getDefined(2, options.fade);

    super(x, y, options);

    this.angle = getDefined(0, options.angle);
    this.aVelocity = getDefined(0, options.aVelocity);
    this.aAcceleration = getDefined(0, options.aAcceleration);

    this.aLimit = getDefined(10, options.aLimit);
  }

  /**
   * Apply forces to the confetti
   */
  applyForces() {
    this.drag();
    this.fall();
  }

  /**
   * Update the confetti
   */
  update() {
    super.update();

    this.aAcceleration = this.velocity.y / this.mass;

    this.aVelocity += this.aAcceleration;
    this.aVelocity = constrain(-this.aLimit, this.aLimit);
    this.angle = this.aVelocity;

    this.aAcceleration = 0;
  }

  /**
   * Display the confetti
   */
  display() {
    push();

    // this.color.setAlpha(this.ttl);
    fill(this.color);
    // this.color.setAlpha(255);
    noStroke();

    translate(this.position.x, this.position.y);
    rotate(this.angle);

    rectMode(CENTER);

    rect(0, 0, this.radius*2);

    pop();
  }

  /**
   * Apply gravity to the confetti
   */
  fall() {
    let gravityConstant = 0.1;
    let force = createVector(0, this.mass);

    force.mult(gravityConstant);

    this.applyForce(force);
  }
}