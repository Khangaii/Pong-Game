class Particle {
  /**
   * Create a new particle
   * @param {number} x - The x position of the particle
   * @param {number} y - The y position of the particle
   * @param {Object} options - The options for the particle
   * @param {p5.Vector} options.velocity - The velocity of the particle
   * @param {p5.Vector} options.acceleration - The acceleration of the particle
   * @param {number} options.radius - The radius of the particle
   * @param {number} options.limit - The limit of the particle
   * @param {p5.Color} options.color - The color of the particle
   * @param {number} options.fade - The fade rate of the particle
   * @param {number} options.mass - The mass of the particle
   */
  constructor(x, y, options = {}) {
    this.position = createVector(x, y);
    this.velocity = getDefined(createVector(random(-2, 2), random(-1, -3)), options.velocity);
    this.acceleration = getDefined(createVector(0, 0), options.acceleration);

    this.radius = getDefined(2, options.radius);

    this.limit = getDefined(10, options.limit);

    this.color = getDefined(color(127), options.color);

    this.ttl = 255;

    this.fade = getDefined(3, options.fade);

    this.mass = getDefined(round(this.radius**2 * PI / 100, 1), options.mass);
  }

  /**
   * Apply forces to the particle
   */
  applyForces() {
    this.drag();
  }

  /**
   * Update the particle
   */
  update() {
    this.ttl -= this.fade;

    this.applyForces();

    this.velocity.add(this.acceleration);
    this.velocity.limit(this.limit);
    this.position.add(this.velocity);

    this.acceleration.mult(0);
  }

  /**
   * Display the particle
   */
  display() {
    push();

    this.color.setAlpha(this.ttl);
    fill(this.color);
    this.color.setAlpha(255);
    noStroke();

    ellipseMode(RADIUS);

    ellipse(this.position.x, this.position.y, this.radius*2);

    pop();
  }

  /**
   * Check if the particle is dead
   * @returns {boolean} Whether or not the particle is dead
   */
  isDead() {
    if(this.ttl > 0) {
      return false;
    } else {
      return true;
    }
  }

  /**
   * Apply a force to the particle
   * @param {p5.Vector} force - The force to apply
   */
  applyForce(force) {
    let f = p5.Vector.div(force, this.mass);

    this.acceleration.add(f);
  }

  /**
   * Apply drag to the particle
   */
  drag() {
    let drag = this.velocity.copy();
    drag.normalize();
    drag.mult(-1);

    let dragCoefficient = 0.001;
    let speedSq = this.velocity.magSq();

    drag.setMag(dragCoefficient * speedSq);

    this.applyForce(drag);
  }
}