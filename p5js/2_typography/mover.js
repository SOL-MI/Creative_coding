class Mover {
  constructor(m, x, y) {
    this.mass = m;
    this.position = createVector(x, y);
    this.velocity = createVector(0, 0);
    this.acceleration = createVector(0, 0);
    this.hasInitialVelocity = false;
    this.isActive = true;

    this.alpha = 255;
    this.angle = 0;
  }

  applyForce(force) {
    let f = p5.Vector.div(force, this.mass);
    this.acceleration.add(f);
  }

  applyRandomVelocity() {
    if (!this.hasInitialVelocity) {
      // 초기 속도가 아직 적용되지 않았다면
      this.velocity = createVector(random(-1, 1), random(-1, 1));
      this.hasInitialVelocity = true; // 초기 속도 적용
    }
  }

  update() {
    if (this.isActive) {
      this.applyFriction(); // 마찰력

      this.velocity.add(this.acceleration);
      this.position.add(this.velocity);
      this.acceleration.mult(0);
      // this.checkVelocity();

      if (this.hasInitialVelocity && this.alpha > 0) {
        this.alpha -= random(1, 8); // 투명도를 점진적으로 감소
      }

      this.angle += 10;
    }
  }

  // checkVelocity() {
  //   if (
  //     (this.velocity.mag() < 0.01 && this.hasInitialVelocity) ||
  //     millis() - this.createTime > 3000
  //   ) {
  //     // 속도가 0.1 이하인 경우
  //     this.isActive = false; // 객체를 비활성화
  //   }
  // }

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

  display(index) {
    // print(index);
    noStroke();
    let colorHue = map(this.mass, 0.5, 4, 0, 230);

    colorMode(HSB, 255);
    fill(colorHue, 150, 230, this.alpha);

    ellipse(
      this.position.x + sin(this.angle + index) * 1.5,
      this.position.y + sin(this.angle + index * 2),
      2,
      2
    );
    // ellipse(this.position.x, this.position.y, 2, 2);
  }

  checkEdges() {
    // if (this.position.x > width) {
    //   this.position.x = width;
    //   this.velocity.x *= -1;
    // } else if (this.position.x < 0) {
    //   this.velocity.x *= -1;
    //   this.position.x = 0;
    // }
    // if (this.position.y > height) {
    //   this.velocity.y *= -1;
    //   this.position.y = height;
    // }
    if (
      this.position.x > width ||
      this.position.x < 0 ||
      this.position.y > height ||
      this.position.y < 0 ||
      this.alpha <= 0
    ) {
      this.isActive = false; // 화면 밖으로 나가거나 alpha 값이 0 이하가 되면 비활성화
    }
  }
}
