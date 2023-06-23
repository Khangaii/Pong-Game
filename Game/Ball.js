class Ball {
  /**
   * Create a ball
   * @param {Object} options - The options for the ball
   * @param {p5.Vector} options.position - The position of the ball
   * @param {p5.Vector} options.velocity - The velocity of the ball
   * @param {p5.Vector} options.acceleration - The acceleration of the ball
   * @param {number} options.initialMag - The initial magnitude of the ball
   * @param {number} options.accelSpeed - The acceleration speed of the ball
   * @param {number} options.limit - The maximum speed of the ball
   * @param {number} options.radius - The radius of the ball
   * @param {color} options.neutralColor - The neutral color of the ball
   * @param {color} options.leftColor - The left color of the ball
   * @param {color} options.rightColor - The right color of the ball
   * @param {number} options.strokeWeight - The stroke weight of the ball
   * @param {number} options.mass - The mass of the ball
   */
  constructor(options = {}) {
    this.initialMag = 10 || options.initialMag;

    this.position = getDefined(createVector(windowWidth/2, windowHeight/2), options.position);
    this.velocity = getDefined(createVector(-this.initialMag, 0), options.velocity);
    this.acceleration = getDefined(createVector(0, 0), options.acceleration);

    // The rate of acceleration of the ball
    this.accelSpeed = getDefined(1, options.accelSpeed);

    // The maximum speed of the ball
    this.limit = getDefined(25, options.limit);

    this.radius = getDefined(20, options.radius);

    // The colors of the ball
    let white = color(255);
    let neutral = getDefined(color(127), options.neutralColor);
    let left = getDefined(color(75, 115, 225), options.leftColor);
    let right = getDefined(color(239, 71, 111), options.rightColor);
    this.colors = [];
    this.colors.push(neutral);
    this.colors.push(lerpColor(white, left, 0.8));
    this.colors.push(lerpColor(white, right, 0.8));

    // The ball's current color
    this.color = this.colors.at(0);

    // The stroke weight
    this.strokeWeight = getDefined(0, options.stokeWeight);

    this.mass = getDefined(round(this.radius**2 * PI / 100, 1), options.mass);

    // The owner of the ball
    this.owner = 0;
  }

  /**
   * Applies a force to the ball
   */
  applyForce(force) {
    let f = force.copy();

    f.div(this.mass);

    this.acceleration.add(f);
  }

  /**
   * Displays the ball
   */
  display() {
    push();

    stroke(0);
    strokeWeight(this.strokeWeight);

    fill(this.color);

    ellipseMode(RADIUS);
    ellipse(this.position.x, this.position.y, this.radius);

    pop();
  }

  /**
   * Updates the ball
   */
  update() {
    this.move();

    this.velocity.add(this.acceleration);
    this.velocity.limit(this.limit);
    this.position.add(this.velocity);

    this.acceleration.mult(0);
  }

  /**
   * Manipulates the ball so it isn't too slow to reach the opposite side
   */
  move() {
    let angle = this.velocity.heading();
    let angleLimit = 75;

    if(angle < 0) {
      angle += 180;
    }

    let rotation = 0;
    let change = 1;

    if(angle > angleLimit && angle <= 90) {
      rotation = -change;
    } else if(angle < 180-angleLimit && angle > 90) {
      rotation = change;
    }

    // Rotate the velocity vector towards the opposite side
    this.velocity.rotate(rotation);

    // Accelerate the ball until it reaches the limit
    if(this.velocity.mag() < this.limit) {
      let force = p5.Vector.fromAngle(radians(this.velocity.heading()), this.accelSpeed / this.velocity.mag())
      this.applyForce(force);
    }
  }

  /**
   * Sets the owner of the ball
   * @param {Number} owner - The owner of the ball; 0: neutral, 1: left, 2: right
   */
  setOwner(owner) {
    this.owner = owner;

    this.color = this.colors.at(owner);
  }

  /**
   * Plays a bounce sound
   * @param {Number} mag - The magnitude of the velocity
   */
  bounceSound(mag = -1) {
    let num = 0;
    if(mag < 0) {
      num = floor(random(BOUNCESFX_NUM));
    } else {
      num = constrain(BOUNCESFX_NUM - floor((mag * BOUNCESFX_NUM) / (this.limit)) - 1, 0, BOUNCESFX_NUM-1);
    }

    bounceSounds[num].play();
  }

  /**
   * Bounds the ball off the edges of the screen
   */
  checkEdges() {
    let left = this.position.x - this.radius,
        right = this.position.x + this.radius,
        top = this.position.y - this.radius,
        bottom = this.position.y + this.radius;
      
    let normal = createVector(0, 0);

    if(left < 0 || right > width) {
      return 0;
    }

    if(top < 0) { // touching top border
      this.bounceSound(this.velocity.mag());

      this.position.y = this.radius;
      normal.set(0, 1);
    } else if(bottom > height) { // touching bottom border
      this.bounceSound(this.velocity.mag());

      this.position.y = height - this.radius;
      normal.set(0, -1);
    }

    this.velocity.reflect(normal);

    return 1;
  }

  /**
   * Checks if the ball is colliding with a rectangle using the Separating Axis Theorem
   * @param {Number} x - The x position of the rectangle
   * @param {Number} y - The y position of the rectangle
   * @param {Number} w - The width of the rectangle
   * @param {Number} h - The height of the rectangle
   * @param {Number} mode - The mode of the rectangle
   * @return {Number} The type of collision; 0: not colliding, 1: colliding with side, 2: colliding with corner
   */
  checkCollisionRect(x, y, w, h, mode = CENTER) {
    // Convert the mode to center
    if(mode !== CENTER) {
      if(mode === CORNER) {
        x = x + w / 2;
        y = y + h / 2;
      } else if(mode === CORNERS) {
        w = w - x;
        h = h - y;
        x = x + w / 2;
        y = y + h / 2;
      } else if(mode === RADIUS) {
        w *= 2;
        h *= 2;
      } else {
        console.warn(`${mode} is not a valid mode`);

        return this.checkCollisionRect(x, y, w, h);
      }
    }

    let rect = {x: x, y: y, width: w, height: h};

    // distance between centers
    let dist = {x: abs(this.position.x - rect.x), y: abs(this.position.y - rect.y)};
    
    // definitely not colliding
    if(dist.x >= (rect.width/2 + this.radius)) {
      return 0;
    }
    if(dist.y >= (rect.height/2 + this.radius)) {
      return 0;
    }

    // definitely colliding
    if(dist.x < rect.width/2) {
      return 1;
    }
    if(dist.y < rect.height/2) {
      return 1;
    }

    // possibly corner collision
    let dx = dist.x - rect.width/2;
    let dy = dist.y - rect.height/2;

    return (dx**2 + dy**2 < this.radius**2) * 2;
  }

  /**
   * Checks if the ball is colliding with a circle
   * @param {Number} x - The x position of the circle
   * @param {Number} y - The y position of the circle
   * @param {Number} r - The radius of the circle
   * @param {Number} mode - The mode of the circle
   * @return {Number} - The type of collision; 0: not colliding, 1: colliding
   */
  checkCollisionCircle(x, y, r, mode = RADIUS) {
    if(dist(this.position.x, this.position.y, x, y) < this.radius + r) {
      return 1;
    } else {
      return 0;
    }
  }

  /**
   * Collides the ball with the objects using Continuous Collision Detection
   * @param {Object} arguments - The objects to collide with
   * @param {Object} arguments.function - The function to call
   * @param {Array} arguments.args - The arguments to pass to the function
   * @return {Number} Whether the ball is colliding with an object; 0: not colliding, 1: collided
   */
  collideObjects() {
    let ret = 1;
    this.position.sub(this.velocity);

    let magnitude = this.velocity.mag();
    let stepNum = floor(magnitude / this.radius);
    let stepVector = this.velocity.copy();
    stepVector.setMag(this.radius);
    let lastStep = p5.Vector.rem(this.velocity, stepVector);

    // check for collisions at each step
    for(let i = 0; i < stepNum; i++) {
      this.position.add(stepVector);

      for(let object of arguments) {
        object.function.apply(this, object.args);
  
        if(this.checkEdges() === 0) {
          ret = 0;
        };
        magnitude = this.velocity.mag();
        stepNum = floor(magnitude / this.radius);
        stepVector = this.velocity.copy();
        stepVector.setMag(this.radius);
        lastStep = p5.Vector.rem(this.velocity, stepVector);
      }
      if(ret === 0) {
        return 0;
      }
    }

    this.position.add(lastStep);

    for(let object of arguments) {
      object.function.apply(this, object.args);

      if(this.checkEdges() === 0) {
        ret = 0;
      }
    }
    if(ret === 0) {
      return 0;
    }

    return 1;
  }

  /**
   * Collides the ball with the paddles using Continuous Collision Detection
   * @param {Object} leftPaddle - The left paddle
   * @param {Object} rightPaddle - The right paddle
   * @return {Number} Whether the ball is colliding with a paddle; 0: not colliding, 1: collided
   */
  collidePaddles(leftPaddle, rightPaddle) {
    let side;
    this.position.sub(this.velocity);

    let magnitude, stepNum, stepVector, lastStep;

    side = 1;
    for(let paddle of [leftPaddle, rightPaddle]) {
      this.collidePaddle(paddle);

      if(this.checkEdges() === 0) {
        return 0;
      };
      magnitude = this.velocity.mag();
      stepNum = floor(magnitude / this.radius);
      stepVector = this.velocity.copy();
      stepVector.setMag(this.radius);
      lastStep = p5.Vector.rem(this.velocity, stepVector);

      side++;
    }

    // Check for collisions at each step
    for(let i = 0; i < stepNum; i++) {
      this.position.add(stepVector);

      side = 1;
      for(let paddle of [leftPaddle, rightPaddle]) {
        this.collidePaddle(paddle);
  
        if(this.checkEdges() === 0) {
          return 0;
        };
        magnitude = this.velocity.mag();
        stepNum = floor(magnitude / this.radius);
        stepVector = this.velocity.copy();
        stepVector.setMag(this.radius);
        lastStep = p5.Vector.rem(this.velocity, stepVector);

        side++;
      }
    }

    this.position.add(lastStep);

    this.collidePaddle(leftPaddle);
    this.collidePaddle(rightPaddle);

    if(this.checkEdges() === 0) {
      return 0;
    }

    return 1;
  }

  /**
   * Collides the ball with a paddle
   * @param {Object} paddle - The paddle to collide with
   * @return {Number} Whether the ball is colliding with the paddle; 0: not colliding, 1: collided
   */
  collidePaddle(paddle) {
    // Collide with paddle using the paddle's frame of reference
    this.velocity.sub(paddle.velocity);
    let obj = this.collideRect(paddle.position.x, paddle.position.y, paddle.width, paddle.height, CENTER);
    this.velocity.add(paddle.velocity);
    let angle = obj.angle;
    let collided = obj.return;

    if(collided > 0) {
      this.setOwner(paddle.number);

      // Add friction to the collision
      paddle.velocity.rotate(-angle);

      let forces = {parallel : createVector(paddle.velocity.x, 0), perpendicular : createVector(0, paddle.velocity.y)};

      if(paddle.velocity.x * (this.position.x - paddle.position.x) < 0) {
        forces.perpendicular.x = 0;
      }
      if(paddle.velocity.y * (this.position.y - paddle.position.y) < 0) {
        forces.perpendicular.y = 0;
      }

      paddle.velocity.rotate(angle);
      forces.parallel.rotate(angle);
      forces.perpendicular.rotate(angle);

      forces.parallel.mult(paddle.friction);
      // forces.perpendicular.mult(paddle.forceTransfer);

      // this.applyForce(forces.parallel);
      // this.applyForce(forces.perpendicular);
      this.velocity.add(forces.parallel);
      this.velocity.add(forces.perpendicular);
    } else {
      return 0;
    }

    return 1;
  }

  /**
   * Collides the ball with a powerup
   */
  collidePowerup(powerup) {
    if(this.checkCollisionCircle(powerup.position.x, powerup.position.y, powerup.radius) === 1) {
      powerup.enable();
    }
  }

  /**
   * Collides the ball with a rectangle
   * @param {Number} x - The x coordinate of the rectangle
   * @param {Number} y - The y coordinate of the rectangle
   * @param {Number} w - The width of the rectangle
   * @param {Number} h - The height of the rectangle
   * @param {Number} mode - The mode of the rectangle
   * @return {Object} return: Whether the ball is colliding with the rectangle; 0: not colliding, 1: collided; angle: The angle of the collision
   */
  collideRect(x, y, w, h, mode = CENTER) {
    if(mode !== CENTER) {
      if(mode === CORNER) {
        x = x + w / 2;
        y = y + h / 2;
      } else if(mode === CORNERS) {
        w = w - x;
        h = h - y;
        x = x + w / 2;
        y = y + h / 2;
      } else if(mode === RADIUS) {
        w *= 2;
        h *= 2;
      } else {
        console.warn(`${mode} is not a valid mode`);

        return this.collideRect(x, y, w, h);
      }
    }

    let rect = {x: x, y: y, width: w, height: h};
    let relative = {x: this.position.x - rect.x, y: this.position.y - rect.y};

    let collisionType = this.checkCollisionRect(rect.x, rect.y, rect.width, rect.height, mode);

    let angle = 0;

    if(collisionType === 0) { // not colliding
      return 0;
    } else if(collisionType === 1) { // colliding with side
      this.bounceSound(this.velocity.mag());

      if(abs(relative.x) <= rect.width / 2) { // touching top or bottom
        if(relative.y < 0) { // ball above rect
          angle = this.collideWall(this.position.x, rect.y - rect.height/2, 0);
        } else { // ball below rect
          angle = this.collideWall(this.position.x, rect.y + rect.height/2, 0);
        }
      } else { // touching left or right
        if(relative.x < 0) { // ball left of rect
          angle = this.collideWall(rect.x - rect.width/2, this.position.y, 90);
        } else { // ball right of rect
          angle = this.collideWall(rect.x + rect.width/2, this.position.y, 90);
        }
      }
    } else { // colliding with corner
      this.bounceSound(this.velocity.mag());

      if(relative.x < 0) {
        if(relative.y < 0) {
          this.collidePoint(rect.x - rect.width / 2, rect.y - rect.height / 2);
        } else {
          this.collidePoint(rect.x - rect.width / 2, rect.y + rect.height / 2);
        }
      } else {
        if(relative.y < 0) {
          this.collidePoint(rect.x + rect.width / 2, rect.y - rect.height / 2);
        } else {
          this.collidePoint(rect.x + rect.width / 2, rect.y + rect.height / 2);
        }
      }
    }

    return {return: 1, angle: angle};
  }

  /**
   * Collides the ball with a point
   * @param {Number} x - The x coordinate of the point
   * @param {Number} y - The y coordinate of the point
   * @return {Number} - Whether the ball is colliding with the point; 0: not colliding, 1: collided
   */
  collidePoint(x, y) {
    let tempX = x - this.position.x, tempY = y - this.position.y, angle;

    if(tempY === 0) {
      angle = 90;
      return this.collideWall(x, y, 90);
    } else {
      angle = atan(-tempX / tempY);

      return this.collideWall(x, y, angle);
    }
  }
  
  /**
   * Collides the ball with a line
   * @param {Number} x - The x coordinate of the a point on the line
   * @param {Number} y - The y coordinate of the a point on the line
   * @param {Number} angle - The angle of the line
   * @return {Number} The angle of the collision
   */
  collideWall(x, y, angle) {
    let dist, dx, dy;

    if(angle === 90 || angle === -90) {
      dist = this.radius - abs(this.position.x - x);
      if(this.position.x < x) {
        dx = -dist;
      } else {
        dx = dist;
      }
      dy = 0;
    } else {
      let rotation = 0;
      let m = tan(angle);
      let n = y - m*x;
      dist = abs(m*this.position.x - this.position.y + n) / sqrt(m**2 + 1);
      dist = this.radius - dist;

      // point on line with circle's x position
      let lineY = m*this.position.x + n;
      let relativeY = this.position.y - lineY;

      if(relativeY < 0) { // ball above line
        rotation = -90;
      } else { // ball below line
        rotation = 90;
      }

      angle += rotation;

      dx = dist * cos(angle);
      dy = dist * sin(angle);

      angle -= rotation;
    }

    this.position.x += dx;
    this.position.y += dy;

    let normal = createVector(dx, dy);
    this.velocity.reflect(normal);

    return angle;
  }
}