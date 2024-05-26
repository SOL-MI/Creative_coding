class Mover {
  constructor(m, x, y) {
    this.mass = m;
    this.position = createVector(x, y);
    this.velocity = createVector(0, 0);
    this.acceleration = createVector(0, 0);
    this.hasInitialVelocity = false;
  }

  applyForce(force) {
    let f = p5.Vector.div(force, this.mass);
    this.acceleration.add(f);
  }

  applyRandomVelocity() {
    if (!this.hasInitialVelocity) {
      // 초기 속도가 아직 적용되지 않았다면
      this.velocity = createVector(random(-1, 1), random(-1, 1));
      this.hasInitialVelocity = true; // 초기 속도 적용됨
    }
  }

  update() {
    this.applyFriction(); // 마찰력

    this.velocity.add(this.acceleration);
    this.position.add(this.velocity);
    this.acceleration.mult(0);
  }

  applyFriction() {
    let frictionCoefficient = 1; // 마찰 계수
    let normalForce = 1;
    let frictionMagnitude = frictionCoefficient * normalForce;

    // 마찰력 계산: 속도의 반대 방향
    let friction = this.velocity.copy();
    friction.mult(-1);
    friction.normalize();
    friction.mult(frictionMagnitude);

    this.applyForce(friction);
  }

  display() {
    noStroke();
    let colorHue = map(this.mass, 0.5, 4, 0, 230);

    colorMode(HSB, 255);
    fill(colorHue, 150, 230);
    ellipse(this.position.x, this.position.y, 5, 5);
  }

  checkEdges() {
    if (this.position.x > width) {
      this.position.x = width;
      this.velocity.x *= -1;
    } else if (this.position.x < 0) {
      this.velocity.x *= -1;
      this.position.x = 0;
    }
    if (this.position.y > height) {
      this.velocity.y *= -1;
      this.position.y = height;
    }
  }
}
