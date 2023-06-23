class PowerupSystem {
  /**
   * Create a new powerup system
   */
  constructor() {
    this.powerups = [];
    for(let i = 0; i < arguments.length; i++) {
      this.powerups.push(arguments[i]);
    }

    this.currentPowerup = null;

    this.timerPos = createVector(windowWidth / 2, windowHeight / 6);

    this.boundaryCorner1 = createVector(windowWidth / 5, windowHeight / 10);
    this.boundaryCorner2 = createVector(windowWidth * 4 / 5, windowHeight * 9 / 10);

    this.t = 0; // time since last powerup
    this.avgInterval = 600; // interval between powerups
    // this.avgInterval = 0;
    this.variation = 120; // variation of interval
    this.currentInterval = this.avgInterval + floor(random(-this.variation, this.variation));

    let baseProbability = 1 / this.powerups.length;
    this.probabilities = [];
    for(let i = 0; i < this.powerups.length; i++) {
      this.probabilities.push(baseProbability);
    }
    this.probabilityReductionRate = 0.3;
  }

  /**
   * Update the powerup system
   */
  update() {
    if(this.currentPowerup === null) {
      if(this.t >= this.currentInterval && this.powerups.length > 0) {
        let index = this.getRandomIndex();
        let xPos = floor(random(this.boundaryCorner1.x, this.boundaryCorner2.x));
        let yPos = floor(random(this.boundaryCorner1.y, this.boundaryCorner2.y));

        this.currentPowerup = this.powerups[index];

        this.reduceProbability(index);

        this.currentPowerup.moveTo(xPos, yPos);

        this.t = 0;

        this.currentInterval = this.avgInterval + floor(random(-this.variation, this.variation));
      } else {
        this.t++;
      }
    } else if(this.currentPowerup.update() === 0) {
      this.currentPowerup = null;
    }
  }

  /**
   * Display the powerup system
   */
  display() {
    if(this.currentPowerup !== null) {
      this.currentPowerup.display();

      if(this.currentPowerup.isActive) {
        push();

        textFont(gameFont);
        textSize(40);
        textAlign(CENTER);
        fill(0);
        noStroke();

        text(this.currentPowerup.remainingTime, this.timerPos.x, this.timerPos.y);

        pop();
      }
    }
  }

  /**
   * Reset the powerup system
   */
  reset() {
    if(this.currentPowerup !== null) {
      this.currentPowerup.disable();
      this.currentPowerup = null;
    }

    this.t = 0;
    this.currentInterval = this.avgInterval + floor(random(-this.variation, this.variation));
  }

  /**
   * Reduce the probability of a powerup being spawned
   * @param {Number} index - The index of the powerup
   */
  reduceProbability(index) {
    let lostAmount = this.probabilities[index] * (1-this.probabilityReductionRate);
    let increase = lostAmount / (this.probabilities.length - 1);

    this.probabilities[index] *= this.probabilityReductionRate;

    for(let i = 0; i < index; i++) {
      this.probabilities[i] += increase;
    }
    for(let i = index + 1; i < this.probabilities.length; i++) {
      this.probabilities[i] += increase;
    }
  }

  /**
   * Get a random index based on the probabilities
   * @returns {Number} The index of a powerup
   */
  getRandomIndex() {
    let rand = random();
    let probability = 0;

    for(let i = 0; i < this.probabilities.length; i++) {
      probability += this.probabilities[i];

      if(rand <= probability) {
        return i;
      }
    }

    return -1;
  }
}