class Mover {
  constructor(x, y, color) {
    this.position = createVector(x, y);
    this.velocity = createVector();
    this.acceleration = createVector();
    this.mass = 1.0;
    this.angle = 0;
    this.angleVelocity = random(-0.1, 0.1);
    this.angleAcceleration = 0.1;
    this.color = color;
    this.size = random(30, 100);
  }

  update() {
    this.velocity.add(this.acceleration);
    this.velocity.mult(0.3);
    this.position.add(this.velocity);
    this.angleAcceleration = this.acceleration.x / 10.0;

    this.angleVelocity += this.angleAcceleration;
    this.angleVelocity = constrain(this.angleVelocity, -0.1, 0.1);

    this.angle += this.angleVelocity;
    this.acceleration.mult(0);

    // 마우스와의 거리에 따라 크기 조정
    this.updateSizeBasedOnMouseDistance();
  }

  updateSizeBasedOnMouseDistance() {
    let distance = dist(mouseX, mouseY, this.position.x, this.position.y);
    if (distance < 100) {
      let newSize = map(distance, 0, 100, 100, 30);
      this.size = newSize;
    } else {
      this.size = 30;
    }
  }

  display() {
    noStroke();
    fill(this.color);
    rectMode(CENTER);

    push();
    translate(this.position.x, this.position.y); // 회전 중심
    rotate(this.angle);
    ellipse(
      windowWidth / 2 + random(0, 100),
      windowHeight / 2,
      this.size,
      this.size
    );
    pop();
  }
}
