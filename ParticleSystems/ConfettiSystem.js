class ConfettiSystem extends ParticleSystem {
  /**
   * Create a new confetti system
   * @param {number} x - The x position of the system
   * @param {number} y - The y position of the system
   * @param {Object} options - The options for the system
   * @param {number} options.emitSpeed - The speed at which the system emits particles
   * @param {Array} options.colors - The colors of the confetti
   */
  constructor(x, y, options = {}) {
    options.emitSpeed = getDefined(2, options.emitSpeed);

    super(x, y, options);

    this.colors = getDefined([], options.colors);
    this.colors.push(color(7, 42, 200));
    this.colors.push(color(255, 98, 1));
    this.colors.push(color(30, 150, 252));
    this.colors.push(color(156, 236, 91));
    this.colors.push(color(240, 244, 101));
  }

  /**
   * Emit confetti
   * @param {number} amount - The amount of confetti to emit
   */
  emit(amount) {
    let colorAmt = this.colors.length;
    let index1 = floor(random(colorAmt));
    let index2 = floor(random(colorAmt));
    let amt = random();
    let clr = lerpColor(this.colors[index1], this.colors[index2], amt);

    for(let i = 0; i < amount; i++) {
      this.particles.push(new Confetti(this.position.x, this.position.y, {
        color: clr
      }));
    }
  }
}