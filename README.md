# Pong Game

## About

This is a modern take on the classic Atari Pong game with more advanced collision handling software and modern game mechanics using the JavaScript library p5.js.

### Controls

Player 1:
* Move up: `W`
* Move down: `S`

Player 2:
* Move up: `I`
* Move down: `K`

General:
* Pause: `P`
* Restart round: `R`
* Restart game: `SHIFT+R`
* Change framerate: `0`~`9`

<img src="https://github.com/Khangaii/Pong-Game/assets/92357084/8830af4c-886a-4eb8-901d-3cc48fb20570" >

### Collision Handling

The physics engine for this game was made after researching various collision detection and resolution techniques.
The game makes use of concepts such as Axis-Aligned Bounding Boxes (AABB), Separating Axis Theorem (SAT), and Continuous Collision Detection (CCD)

## Arduino Controls

In the `/index.html` file, there is the below code:
```HTML
<script src="Game/keyboardVer/sketch.js"></script>
<!-- <script src="Game/arduinoVer/sketch.js"></script> -->

<script src="Game/keyboardVer/Paddle.js"></script>
<!-- <script src="Game/arduinoVer/Paddle.js"></script> -->
```

You can change this to the below code if you want to use an arduino controller, remember to set the pins correctly:
```HTML
<!-- <script src="Game/keyboardVer/sketch.js"></script> -->
<script src="Game/arduinoVer/sketch.js"></script>

<!-- <script src="Game/keyboardVer/Paddle.js"></script> -->
<script src="Game/arduinoVer/Paddle.js"></script>
```

**Arduino control using buttons:**
```INO
const int BUTTON_NUM = 4;

const int INPUT_PINS[BUTTON_NUM] = {10, 9, 3, 2};
char prevOutput[BUTTON_NUM+1] = "0000", output[BUTTON_NUM+1] = "0000";
bool changed = false;

void setup() {
  Serial.begin(9600);

  for(int i = 0; i < 4; i++) {
    pinMode(INPUT_PINS[i], INPUT_PULLUP);
  }
}

void loop() {
  int state;
  
  changed = false;
  
  for(int i = 0; i < 4; i++) {
    state = digitalRead(INPUT_PINS[i]);
    state = (char)(1 - state + '0');

    if(output[i] != state) {
      changed = true;
    }

    output[i] = state;
  }

  if(changed == true) {
    Serial.println(output);
  }
}
```

**Arduino controls using joysticks:**
```INO
#define P1_PIN A0
#define P2_PIN A1

int p1Value, p2Value;
int *state[2] = {"00", "00"};
char output[5] = "0000", prevOutput[5] = "0000";

void setup() {
  Serial.begin(9600);
}

void loop() {
  strcpy(state[0], "00");
  strcpy(state[1], "00");
  
  p1Value = analogRead(P1_PIN);
  p2Value = analogRead(P2_PIN);
  if(p1Value > 700) {
    state[0][0] = '1';
  } else if(p1Value < 300) {
    state[0][1] = '1';
  }
  if(p2Value > 700) {
    state[1][0] = '1';
  } else if(p1Value < 300) {
    state[1][1] = '1';
  }

  strcpy(output, state[0]);
  strcat(output, state[1]);

  if(strcmp(output, prevOutput) != 0) {
    println(output);

    strcpy(prevOutput, output);
  }
}
```
