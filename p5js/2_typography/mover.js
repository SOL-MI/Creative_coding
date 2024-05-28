class Mover {
  constructor(m, x, y) {
    this.mass = m;
    this.position = createVector(x, y);
    this.velocity = createVector(0, 0);
    this.acceleration = createVector(0, 0);
    this.hasInitialVelocity = false;
    this.isActive = true;

    this.createTime = millis(); // 객체 생성 시간 기록
    this.minCheckTime = 500; // 최소 체크 시간 (밀리초)
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
      // 시간 체크 후 속도가 임계값 이하인지 확인
      if (millis() - this.createTime > this.minCheckTime) {
        print("들어옴");
        this.checkVelocity();
      }
    }
  }

  checkVelocity() {
    if (this.velocity.mag() < 0.01 && this.hasInitialVelocity) {
      // 속도가 0.1 이하인 경우
      this.isActive = false; // 객체를 비활성화
    }
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

    ellipse(this.position.x, this.position.y, 2, 2);
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
      this.position.y < 0
    ) {
      this.isActive = false; // 화면 밖으로 나가면 비활성화
    }
  }
}
