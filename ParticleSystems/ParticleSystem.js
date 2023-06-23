class ParticleSystem {
  /**
   * Create a new particle system
   * @param {number} x - The x position of the system
   * @param {number} y - The y position of the system
   * @param {Object} options - The options for the system
   * @param {number} options.emitSpeed - The speed at which the system emits particles
   */
  constructor(x, y, options = {}) {
    this.position = createVector(x, y);

    this.emitSpeed = getDefined(1, options.emitSpeed);

    this.particles = [];
  }

  /**
   * Update the system
   */
  update() {
    this.emit(this.emitSpeed);

    for(let i = this.particles.length-1; i >= 0; i--) {
      let particle = this.particles[i];

      particle.update();

      if(particle.isDead()) {
        this.particles.splice(i, 1);
      }
    }
  }

  /**
   * Display the system
   */
  display() {
    for(let i = this.particles.length-1; i >= 0; i--) {
      let particle = this.particles[i];

      particle.display();
    }
  }

  /**
   * Add a particle to the system
   * @param {Particle} particle - The particle to add
   */
  addParticle(particle) {
    this.particles.push(particle);
  }

  /**
   * Emit particles
   * @param {number} amount - The amount of particles to emit
   */
  emit(amount = 1) {
    for(let i = 0; i < amount; i++) {
      this.particles.push(new Particle(this.position.x, this.position.y));
    }
  }
}