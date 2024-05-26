let movers = [];

function setup() {
  createCanvas(windowWidth, windowHeight);

  for (let i = 0; i < 10; i++) {
    let x = random(width);
    let y = random(height / 4);
    let m = random(0.5, 4);
    movers.push(new Mover(m, x, y));
  }
}

function draw() {
  background(0, 0, 0, 50);

  let gravity = createVector(0, 0.1);

  for (let mover of movers) {
    let wind = createVector(0.2 * mover.mass, 0);
    let gravityForce = p5.Vector.mult(gravity, mover.mass); // 질량에 비례하는 중력
    mover.applyForce(gravityForce);

    if (mouseIsPressed) {
      let localWind = wind.copy(); // 원본 'wind' 벡터 복제

      if (mover.position.x < mouseX) {
        localWind.mult(-1); // 마우스 왼쪽에 있을 경우, 방향 반전
      }
      mover.applyForce(localWind);
    }

    mover.update();
    mover.display();
    mover.checkEdges();
  }
}
