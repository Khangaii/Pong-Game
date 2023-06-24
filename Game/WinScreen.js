class WinScreen {
  /**
   * Create a win screen
   * @param {Object} options - The options
   * @param {p5.Color} options.backgroundColor - The background color
   * @param {number} options.width - The width
   * @param {number} options.height - The height
   * @param {p5.Font} options.textFont - The text font
   * @param {p5.Color} options.textColor - The text color
   * @param {number} options.textSize - The text size
   * @param {p5.Color} options.leftColor - The left color
   * @param {p5.Color} options.rightColor - The right color
   */
  constructor(options = {}) {
    this.backgroundColor = color(255, 127) || options.backgroundColor;

    this.winner = 0;

    this.points = [0, 0];

    let width = getDefined(displayWidth, options.width);
    let height = getDefined(displayHeight, options.height);
    this.screen = createGraphics(width, height);

    this.textPos = createVector(width/2, floor(height*3/7));

    this.textSize = getDefined(64, options.textSize);

    this.textColor = getDefined(color(0), options.textColor);

    this.textFont = getDefined(gameFont, options.textFont);

    this.leftColor = getDefined(color(75, 115, 225), options.leftColor);
    this.rightColor = getDefined(color(239, 71, 111), options.rightColor);

    this.confettiSystems = [];
    this.confettiSystems.push(new ConfettiSystem(displayWidth / 4, displayHeight / 4));
    this.confettiSystems.push(new ConfettiSystem(displayWidth * 3 / 4, displayHeight / 4));
  }

  /**
   * Update the win screen
   */
  update() {
    for(let i = 0; i < this.confettiSystems.length; i++) {
      this.confettiSystems[i].update();
    }
  }

  /**
   * Display the win screen
   */
  display() {
    let pg = this.screen;

    pg.push();

    pg.clear();

    pg.background(this.backgroundColor);

    this.displayText();

    for(let i = 0; i < this.confettiSystems.length; i++) {
      this.confettiSystems[i].display(this.screen);
    }

    pg.pop();

    image(pg, 0, 0, windowWidth, windowHeight);
  }

  /**
   * Display the text
   */
  displayText() {
    let pg = this.screen;

    pg.fill(this.textColor);
    pg.textSize(this.textSize);
    pg.textAlign(CENTER);
    pg.textFont(this.textFont);

    pg.text("Player " + this.winner + " Wins!", this.textPos.x, this.textPos.y);
    pg.text(this.points[0], this.textPos.x - pg.width/15, this.textPos.y + pg.height/10);
    pg.text(this.points[1], this.textPos.x + pg.width/15, this.textPos.y + pg.height/10);

    pg.textSize(this.textSize/2);
    pg.text("Restart with Shift+R", this.textPos.x, this.textPos.y + pg.height/4);
  }

  /**
   * Reset the win screen
   */
  reset() {
    this.winner = 0;
    
    for(let i = 0; i < this.confettiSystems.length; i++) {
      let emitter = this.confettiSystems[i];

      emitter.particles.splice(0, emitter.particles.length);
    }
  }
}