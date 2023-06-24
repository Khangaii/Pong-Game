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

// Serial object
let serial;

// Game assets
let stylishFont;
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

  // Instantiate SerialPort object
  serial = new p5.SerialPort();

  // List the ports available
  let portList = serial.list();

  // Open the connection to the Arduino
  serial.open("COM3");

  // Register callbacks

  // When we connect to the underlying server
  serial.on('connected', serverConnected);

  // When we get a list of serial ports that are available
  serial.on('list', gotList);

  // When we some data from the serial port
  serial.on('data', gotData);

  // When or if we get an error
  serial.on('error', gotError);

  // When our serial port is opened
  serial.on('open', gotOpen);

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

function getDefined(var1, var2) {
  /**
   * return the first defined variable
   */
  
  return (var2 === undefined) ? var1 : var2;
}

function togglePause() {
  /**
   * Toggle the pause state of the game
   */

  game.paused = !game.paused;
}

/**
 * Server connected callback
 */
function serverConnected() {
  print("Server connected!");
}

/**
 * Got list of ports callback
 * @param {Array} theList - List of ports
 */
function gotList(theList) {
  for (let i = 0; i < theList.length; i++) {
    // Display in the console
    print(i + " " + theList[i]);
  }
}

/**
 * Connected to serial device callback
 */
function gotOpen() {
  print("Serial Port is open!");
}

/**
 * Error callback
 * @param {Object} theError - Error object
 */
function gotError(theError) {
  print(theError);
}

/**
 * Data callback
 * @note This is called whenever data is received from the serial port
 */
function gotData() {
  let data = serial.readStringUntil("\r\n");
  // print(data);
  game.leftPaddle.serialInput = data[0] + data[1];
  game.rightPaddle.serialInput = data[2] + data[3];
}
