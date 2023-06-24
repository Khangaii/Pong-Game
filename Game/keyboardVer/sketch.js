Window.console = console || {warn: function(){}}

const FRAME_RATE = 60;
const MAX_SCORE = 11;
const BOUNCESFX_NUM = 5, VICTORY_MUSIC_NUM = 4;
const SELF = 0, OPPONENT = 1;

// App canvas
let canvas;

// Game objects
let leftPaddle, rightPaddle, ball, leftScore, rightScore, scoreBoard, winScreen, game;
let powerupSystem;

// Game state
let paused = false;

// Game assets
let gameFont;
let cobini;
let bounceSounds = [], scorePointSound, powerupSound, powerdownSound;
let victoryMusicNames = ["rick", "mario", "link", "mrGame"];
let victoryMusic = {};

let icons = {};

/**
 * Loads all game assets
 */
function preload() {
  // Load font
  gameFont = loadFont("./assets/fonts/SUITE-Regular.ttf");

  // Load sounds
  soundFormats('ogg', 'mp3');
  for(let i = 0; i < BOUNCESFX_NUM; i++) {
    bounceSounds.push(loadSound("./assets/sounds/impactSoft_heavy_00" + i));
  }
  scorePointSound = loadSound("./assets/sounds/confirmation_001");
  scorePointSound.setVolume(0.4);
  powerupSound = loadSound("./assets/sounds/confirmation_002");
  powerdownSound = loadSound("./assets/sounds/minimize_006");

  // Load victory music
  for(let i = 0; i < VICTORY_MUSIC_NUM; i++) {
    let musicName = victoryMusicNames[i];
    victoryMusic[musicName] = loadSound("./assets/music/" + musicName);
    victoryMusic[musicName].setVolume(0.3);
  }

  // Get powerup icons
  icons.gravity = loadImage("./assets/images/gravity.png");
  icons.powerup = loadImage("./assets/images/lightning.png");
  icons.expand = loadImage("./assets/images/expand.png");
  icons.shrink = loadImage("./assets/images/shrink.png");
  icons.stretch = loadImage("./assets/images/stretch.png");
  icons.compress = loadImage("./assets/images/compress.png");
  icons.slow = loadImage("./assets/images/snail.png");
  icons.accelerate = loadImage("./assets/images/accelerate.png");
  icons.hidden = loadImage("./assets/images/hidden.png");
  icons.reverse = loadImage("./assets/images/reverse.png");
}

/**
 * Sets up the game
 */
function setup() {
  angleMode(DEGREES);
  frameRate(FRAME_RATE);
  pixelDensity(1);

  canvas = createCanvas(windowWidth, windowHeight);

  leftPaddle = new Paddle(1, {up: 87, down: 83, shift: 16}, 75, windowHeight / 2, {
    color: color(75, 115, 225),
    // height: 2000
  });
  rightPaddle = new Paddle(2, {up: 73, down: 75, shift: 59}, windowWidth - 75, windowHeight / 2, {
    color: color(239, 71, 111),
    // height: 2000
  });

  ball = new Ball({
    // accelSpeed: 100000,
    // limit: 2000000
  });

  // Initialize powerup system
  powerupSystem = new PowerupSystem(
    new GravityPowerup(ball, leftPaddle, rightPaddle),
    new AccelerateBallPowerup(ball, leftPaddle, rightPaddle),
    new SlowPaddlePowerup(ball, leftPaddle, rightPaddle),
    new EnlargePaddlePowerup(ball, leftPaddle, rightPaddle),
    new ShrinkPaddlePowerup(ball, leftPaddle, rightPaddle),
    new HideSidePowerup(ball, leftPaddle, rightPaddle),
    new ReverseInputPowerup(ball, leftPaddle, rightPaddle),
    new EnlargeBallPowerup(ball, leftPaddle, rightPaddle),
    new ShrinkBallPowerup(ball, leftPaddle, rightPaddle)
  );

  leftScore = new Score(width * 9 / 20, height / 10);
  rightScore = new Score(width * 11 / 20, height / 10);

  scoreBoard = new ScoreBoard([leftScore, rightScore]);

  winScreen = new WinScreen();

  game = new Game(leftPaddle, rightPaddle, ball, scoreBoard, winScreen, {
    winningPoints: MAX_SCORE,
    powerupSystem: powerupSystem,
  });

  // Set font
  textFont(gameFont);
}

/**
 * Main game loop
 */
function draw() {
  game.update();
  game.display();
}

/**
 * Handle window resizing
 */
function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}

/**
 * Handle key presses
 */
function keyTyped() {
  switch(key) {
    case '1':
      frameRate(1);
      break;
    case '2':
      frameRate(6);
      break;
    case '3':
      frameRate(12);
      break;
    case '4':
      frameRate(24);
      break;
    case '5':
      frameRate(30);
      break;
    case '6':
      frameRate(36);
      break;
    case '7':
      frameRate(42);
      break;
    case '8':
      frameRate(48);
      break;
    case '9':
      frameRate(54);
      break;
    case '0':
      frameRate(60);
      break;
    case 'p':
      togglePause();
      break;
    case 'r':
      game.restart();
      break;
    case 'R':
      game.reset();
      break;
  }
}

/**
 * return the second argument if it is defined, otherwise return the first argument
 * @param {*} var1 - first argument
 * @param {*} var2 - second argument
 * @returns {*} the second argument if it is defined, otherwise the first argument
 */
function getDefined(var1, var2) {
  return (var2 === undefined) ? var1 : var2;
}

/**
 * Toggle the pause state of the game
 */
function togglePause() {
  game.paused = !game.paused;
}
