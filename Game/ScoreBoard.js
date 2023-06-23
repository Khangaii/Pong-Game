class ScoreBoard {
  /**
   * Create a score board
   * @param {Score} score1 - The first score
   * @param {Score} score2 - The second score
   * @param {Object} options - The options
   */
  constructor(scores, options = {}) {
    this.scores = scores;
  }

  /**
   * Display the score board
   */
  display() {
    for (let i = 0; i < this.scores.length; i++) {
      this.scores[i].display();
    }
  }

  /**
   * Add to the score
   * @param {number} scoreNum - The score number
   * @param {number} score - The score to add
   */
  add(scoreNum, score) {
    this.scores[scoreNum] += score;
  }

  /**
   * Subtract from the score
   * @param {number} scoreNum - The score number
   * @param {number} score - The score to subtract
   */
  sub(scoreNum, score) {
    this.scores[scoreNum] -= score;
  }

  /**
   * Increase the score by one
   * @param {number} scoreNum - The score number
   */
  increase(scoreNum) {
    this.scores[scoreNum]++;
  }

  /**
   * Decrease the score by one
   * @param {number} scoreNum - The score number
   */
  decrease(scoreNum) {
    this.scores[scoreNum]--;
  }
}