class Score {
  /**
   * Creates a score
   * @param {number} x - The x position of the score
   * @param {number} y - The y position of the score
   * @param {number} score - The score
   * @param {Object} options - The options
   * @param {color} options.color - The color of the score
   * @param {number} options.size - The size of the score
   * @param {number} options.strokeWeight - The stroke weight of the score
   * @param {Object} options.style - The style of the score
   * @param {Object} options.alignment - The alignment of the score
   * @param {Object} options.font - The font of the score
   */
  constructor(x, y, score = 0, options = {}) {
    this.score = score;

    this.position = createVector(x, y);

    this.color = getDefined(color(255), options.color);

    this.size = getDefined(48, options.size);

    this.strokeWeight = getDefined(0, options.strokeWeight);

    this.style = getDefined(NORMAL, options.style);

    this.alignment = getDefined(CENTER, options.alignment);

    this.font = getDefined(gameFont, options.font);
  }

  /**
   * Displays the score
   */
  display() {
    push();

    fill(this.color);
    strokeWeight(this.strokeWeight);
    textSize(this.size);
    textStyle(this.style);
    textAlign(this.alignment);
    textFont(this.font);

    text(this.score, this.position.x, this.position.y);

    pop();
  }

  /**
   * Adds to the score
   * @param {number} number - The number to add to the score
   */
  add(number) {
    this.score += number;
  }

  /**
   * Subtracts from the score
   * @param {number} number - The number to subtract from the score
   */
  sub(number) {
    this.score -= number;
  }

  /**
   * Increases the score by 1
   */
  increase() {
    this.score++;
  }

  /**
   * Decreases the score by 1
   */
  decrease() {
    this.score--;
  }

  /**
   * Sets the score
   * @param {number} score - The number to set the score to
   */
  set(score) {
    this.score = score;
  }
}